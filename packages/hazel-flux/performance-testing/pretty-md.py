import pandas as pd

df = pd.read_csv('results.csv')

# Format:
# {
#     'filename': os.path.basename(filepath),
#     'average_time': average_time,
#     'penalty': average_time - baseline,
#     'bytes': byteSize,
#     'msPerMB': average_time / mbSize,
# }

# Round ms to 2 decimal places
df['average_time'] = df['average_time'].round(2)
df['penalty'] = df['penalty'].round(2)
df['msPerMB'] = df['msPerMB'].round(2)

df['Format'] = df['bytes'].apply(lambda x: 'MB' if x > (1024*1024) else 'KB')
df['Size'] = df.apply(lambda x: f'{x["bytes"] / (1024*1024):.2f} MB' if x['Format'] == 'MB' else f'{x["bytes"] / 1024:.2f} KB', axis=1)

# Format bytes
df['Bytes'] = df['bytes'].apply(lambda x: f'{x:,} bytes')

# Format msPerMB
df['MS Per MB'] = df['msPerMB'].apply(lambda x: f'{x:,} ms/MB')

# Format average_time
df['Average'] = df['average_time'].apply(lambda x: f'{x:,} ms')

# Format penalty
df['Penalty'] = df['penalty'].apply(lambda x: f'{x:,} ms')

# Format filename
df['Name'] = df['filename'].apply(lambda x: f'`{x}`')

# Format table
df = df[['Name', 'Penalty', 'Size', 'MS Per MB']]

# Save as markdown
df.to_markdown('results.md', index=False)