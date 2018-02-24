CLI interface
Searches video folders and their subfolders by a part of their name (case insesitive)
The results are the matching videos name, duration, size and directory

the folders are hardcoded in an array called directories
the part of the name is specified by the user in a cli param -s
e.g. we want all videos where the name contains 'node':
node find -s node
if you have spaces in your query, use double quotes, e.g.
node find -s "node js"
