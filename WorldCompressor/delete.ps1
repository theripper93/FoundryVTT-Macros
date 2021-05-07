Get-ChildItem .\* -R -include *.png, *.jpg, *.jpeg, *.gif |
Foreach-Object {
  del $_.FullName
  echo "Deleting $_"
}
pause