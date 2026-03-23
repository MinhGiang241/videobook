$disks =  New-Object System.Collections.Generic.List[string]

Get-Volume | ForEach-Object({
    $disks.Add($_.DriveLetter)
  })

$data= [System.Collections.ArrayList]::new()
$savedData = [System.Collections.ArrayList]::new()

if(-not([System.IO.File]::Exists("./video.json")))
{ 
  $json = Get-Content -Path "./video.json" | ConvertFrom-Json -AsHashtable
  $data.AddRange($json)
}
foreach($disk  in $disks)
{

  if($disk -eq "D" )
  {
    $disk.GetType()
    $folderPath = "$($disk):/New folder"
    Write-Host("$($folderPath) folderPath")
    $folders = Get-ChildItem -Directory -Path $folderPath -Recurse
    foreach ($folder in $folders)
    {
      Write-Host("$($folder) folder")
      $files = Get-ChildItem -Path $folder.FullName -File
      foreach ($file in $files)
      {


        if($file.Extension -ne ".ps1"  -and $file.Extension -ne ".srt")
        {
          $exist =  $data | Where-Object({$_.Name -eq $file.Name})
          if($exist)
          {            
            # $exist.Path= $file.Path
            # $exist.DirectoryName= $file.DirectoryName
            # $savedData.Add($exist)
            Write-Host("$($file.FullName) is Existed")
          } else
          {
         
            $thumbPath = "E:/Video/v/public/thumbs/$($file.BaseName).jpg"
            $imagePath = "/thumbs/$($file.BaseName).jpg"

           
            if(-not([System.IO.File]::Exists($thumbPath)))
            {
              ffmpeg -ss 00:00:30 -i $file.FullName -vframes 1 -q:v 2 $thumbPath
            }
            $videoInfo  = ffprobe -v error -select_streams v:0 -show_entries stream=width,height -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 $file.FullName 
            $info = $videoInfo -split "`n"
            $widthStr = $info[0]
            $heightStr = $info[1]
            $durationStr = $info[-1]
            $fileData = @{
              Disk = $disk
              Folder = $folder.Name
              Name= $file.Name
              Path= $file.FullName
              Size= $file.Length
              LastAccessTime= $file.LastAccessTime
              CreatedAt= $file.CreationTime
              ThumbNail= $thumbPath 
              Type= $file.Extension
              ImagePath= $imagePath
              DirectoryName= $file.DirectoryName
              Width        = ($widthStr -as [int])
              Height       = ($heightStr -as [int])
              Duration     = ($durationStr -as [int])
            } 
            Write-Host("$($file.FullName) New Item")

            $savedData.Add($fileData)
          }
        }
      }
    }
  }

}

if(([System.IO.File]::Exists("./video.json")))
{
  Remove-Item "./video.json"
}
$data.AddRange($savedData)
$data | Sort-Object -Property LastAccessTime -Descending | ConvertTo-Json -Depth 3 | Set-Content -Path "./video.json"
