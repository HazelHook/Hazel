import os
import requests
import glob
import time
import numpy as np

# Define the API endpoint
url = 'http://127.0.0.1:8786'

# Specify the directory containing your JSON files
directory = './data'

start_time = time.time()
global prep_baseline_runs 
global baseline_runs
global prep_json_runs
global json_runs
global sleep_time
global total_runs
global total_wait_time
global total_throughput

prep_baseline_runs = 200
baseline_runs = 2000
prep_json_runs = 5
json_runs = 50
sleep_time = 0.005
total_runs = 0
total_wait_time = 0
total_throughput = 0

def measure_request_time(payload):
    headers = {'Content-Type': 'application/json; charset=utf-8'}
    start_time = time.time()
    response = requests.post(url, data=payload, headers=headers)

    end_time = time.time()

    elapsed_time = (end_time - start_time) * 1000  # Convert to milliseconds
    return elapsed_time


def baseline_time():
    global total_runs
    global total_wait_time
    global total_throughput

    empty_payload = """
    {
        "config": {
            "input_node": {
                "node_type": "json"
            },
            "output_node": {
                "node_type": "json"
            },
            "transformer_nodes": [
                {
                    "node_type": "uppercase"
                }
            ]
        },
        "data": []
    }"""
    empty_payload = empty_payload.encode('utf-8')
    datasize = len(empty_payload)
    for i in range(prep_baseline_runs):
        measure_request_time(empty_payload)
        total_runs += 1
        total_throughput += datasize

    times = []
    for _ in range(baseline_runs):
        times.append(measure_request_time(empty_payload))
        time.sleep(sleep_time)
        total_runs += 1
        total_wait_time += sleep_time
        total_throughput += datasize
    return sum(times) / len(times)

baseline = baseline_time()
print(f'Baseline time: {baseline} ms')

result = [

]

# Loop over all JSON files in the directory
for filepath in glob.glob(os.path.join(directory, '*.json')):
    with open(filepath, 'r') as file:
        data_content = file.read()

    # Construct the payload as a string
    payload = """
    {
        "config": {
            "input_node": {
                "node_type": "json"
            },
            "output_node": {
                "node_type": "json"
            },
            "transformer_nodes": [
                {
                    "node_type": "uppercase"
                }
            ]
        },
        "data": [""" + data_content + """]
    }"""
    payload = payload.encode('utf-8')
    data_size = len(payload)

    print(f'Running test for {filepath}')

    for i in range(prep_json_runs):
        measure_request_time(payload)
        total_runs += 1
        total_throughput += data_size


    times = []
    for i in range(json_runs):
        print(f'    Running test {i}')
        times.append(measure_request_time(payload))
        # sleep for 5ms
        time.sleep(sleep_time)
        total_runs += 1
        total_wait_time += sleep_time
        total_throughput += data_size

    # average_time = sum(times) / len(times)

    byteSize = os.path.getsize(filepath)
    kbSize = byteSize / 1024
    mbSize = kbSize / 1024

    size = kbSize if kbSize < 1024 else mbSize

    times = np.array(times)  # replace 'times' with your list of times

    # Calculate variance
    variance = np.var(times)

    # Calculate percentiles
    percentiles = np.percentile(times, [90, 95, 99])
    average = np.mean(times)


    result.append({
        'filename': os.path.basename(filepath),
        'avg_penalty': average - baseline,
        'avg_average_time': average,
        'avg_msPerMB': average / size,
        'p90_penalty': percentiles[0] - baseline,
        'p90_average_time': percentiles[0],
        'p90_msPerMB': percentiles[0] / size,
        'p95_penalty': percentiles[1] - baseline,
        'p95_average_time': percentiles[1],
        'p95_msPerMB': percentiles[1] / size,
        'p99_penalty': percentiles[2] - baseline,
        'p99_average_time': percentiles[2],
        'p99_msPerMB': percentiles[2] / size,
        'variance': variance,
        'bytes': byteSize,
    })

# construct a dataframe from the results
import pandas as pd
df = pd.DataFrame(result)

# save as csv
df.to_csv('results.csv', index=False)

end_time = time.time()

# Save metadata csv
metadata = {
    'baseline': baseline,
    'total_time': end_time - start_time,
    'total_runs': total_runs,
    'total_wait_time': total_wait_time,
    'total_throughput': total_throughput,
    'prep_baseline_runs': prep_baseline_runs,
    'baseline_runs': baseline_runs,
    'prep_json_runs': prep_json_runs,
    'json_runs': json_runs,
    'sleep_time': sleep_time,
}
df = pd.DataFrame([metadata])
df.to_csv('metadata.csv', index=False)
