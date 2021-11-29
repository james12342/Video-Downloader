ffmpeg -r 1/5 -i "%03d.jpg" -c:v libx264 -vf fps=25 -pix_fmt yuv420p out.mp4
ffmpeg -framerate 1 -pattern_type glob -i '.jpg' video.mp4