import pandas as pd
import matplotlib.pyplot as plt
import mplcursors

tests = ['test-json-serialization', 'test-stream-back', 'test-text-return']

# Function to process and filter data
def process_data(file_name):
    # Load the data into a DataFrame
    df = pd.read_csv(file_name)

    # Convert bytes to MB
    df['bytes_in_MB'] = df['bytes'] / (1024 * 1024) 

    # Filter to include only files of 1MB or less
    df_filtered = df[df['bytes_in_MB'] <= 100]
    
    return df_filtered

# Scatter plot of avg_average_time against bytes for both DataFrames
plt.figure(figsize=(10, 6))

dfs = []
scatters = []
for test in tests:
    df = process_data(f'results/{test}/results.csv')
    dfs.append(df)
    scatter = plt.scatter(df['bytes_in_MB'], df['avg_average_time'], alpha=0.5, label=test)
    scatters.append(scatter)

plt.xlabel('File Size (MB)')
plt.ylabel('Average Time (ms)')
plt.xlim(left=0)
plt.ylim(bottom=0)
plt.title('Average Processing Time vs File Size for files of 1MB or less')
plt.legend()

cursor = mplcursors.cursor(scatters, hover=True)

# This function will be called each time the mouse hovers over a point
@cursor.connect("add")
def on_add(sel):
    sel.annotation.set_text(f'Size: {sel.target[0]:.2f} MB, Time: {sel.target[1]:.2f} ms')

plt.show()
