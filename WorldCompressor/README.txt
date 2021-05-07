You will need ImageMagick for the conversion to work https://imagemagick.org/index.php
the Convert script converts all png\jpg\jpeg\gif in the folder you run it in and all it's subfolders
the Delete script deletes all png\jpg\jpeg\gif in the folder you run it in and all it's subfolders

0. MAKE A FULL BACKUP OF YOUR FOUNDRY DATA
1. Install ImageMagick
2. Run the Convert script on all the desired files (make sure foundry is closed just in case)
3. Run the Delete script (if you are sure that those image files are only on tokens,scenes backgrounds, avatars, tiles, journals, macro icons, items)
   or delete manually if unsure (make sure foundry is closed just in case)
4. Run the updateAllPNGtoWEBP script macro from within your world - open the console to see the progress
5. Profit

*. Optionally you can run step 3 after step 4