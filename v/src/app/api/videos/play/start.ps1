param (
  [Parameter(Mandatory = $true)]
  [string]$Path
)
Start-Process $Path 
exit 1
