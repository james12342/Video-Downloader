ffmpeg -framerate 1/1 -i img%d.jpg -c:v libx264 -vf fps=25 -pix_fmt yuv420p out4.mp4