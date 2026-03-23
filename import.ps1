mongoimport --db V --collection videos --file "./video.json" --jsonArray --batchSize 1000


# $data= [System.Collections.ArrayList]::new()
#
# if(-not([System.IO.File]::Exists("./video.json")))
# { 
#   $json = Get-Content -Path "./video.json" | ConvertFrom-Json -AsHashtable
#   $data.AddRange($json)
# }

# Tạo hai ArrayList mới
# $al1 = New-Object System.Collections.ArrayList
# $al2 = New-Object System.Collections.ArrayList

# Chia danh sách
# $al1.AddRange($data.GetRange(0, [math]::Min(4000, $data.Count)))
# $al2.AddRange($data.GetRange(4958, $data.Count - 4958))
#
# $data.Count
# $al1.Count
# $al2.Count


# $al1 | Sort-Object -Property LastAccessTime -Descending | ConvertTo-Json -Depth 3 | Set-Content -Path "./video1.json"
#
# $al2 | Sort-Object -Property LastAccessTime -Descending | ConvertTo-Json -Depth 3 | Set-Content -Path "./video2.json"
#
#
# mongoimport --db V --collection videos --file "./video1.json" --jsonArray --batchSize 1000
#
# mongoimport --db V --collection videos --file "./video.json" --jsonArray --batchSize 1000
#
# Remove-Item "./video1.json"
# Remove-Item "./video2.json"
