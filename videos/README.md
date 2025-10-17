
# Jitar | Videos

In this directory, you can find the source files for the videos that are created as part of the Jitar project. These videos are designed to introduce and explain various aspects of Jitar, including its features, usage, and benefits.

## Tooling

The videos are generated using a combination of scripts and configuration files. Our primary tool is [pdf2vid](https://github.com/MaskingTechnology/pdf2vid), our internal tool that converts PDF frames into video and generates voice-overs using text-to-speech technology.

To use this tool, you'll need to link the `pdf2vid` script. Please read the instructions in the `pdf2vid` repository for more details on how to set it up.

```bash
ln -s path/to/pdf2vid/pdf2vid pdf2vid
```

## Generating Videos

Within each video project, you can run the `build.sh` script.

```bash
./build.sh
```

This will build all scenes and chapters that are not built yet, or updated before (re)building the video.
