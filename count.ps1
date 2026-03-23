$json = Get-Content -Path "./video.json" | ConvertFrom-Json -AsHashtable

$json.Length
