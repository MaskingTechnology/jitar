
# Jitar | Videos

In this directory, you can find the source files for the videos that are created as part of the Jitar project. These videos are designed to introduce and explain various aspects of Jitar, including its features, usage, and benefits.

## Videos

The only video that is currently available is the `Jitar introduction` video, which provides an overview of Jitar and its capabilities.

## Tooling

The videos are generated using a combination of scripts and configuration files. Our primary tool is [pdf2vid](https://github.com/MaskingTechnology/pdf2vid), our internal tool that converts PDF frames into video and generates voice-overs using text-to-speech technology.

To use this tool, you'll need to link the `pdf2vid` repository as a folder in this folder. Please read the instructions in the `pdf2vid` repository for more details on how to set it up.

```bash
ln -s path/to/pdf2vid pdf2vid
```
Alternatively, you can copy the repository directly into this folder:

```bash
cp -r path/to/pdf2vid pdf2vid
```

## Generating Videos

Within each video project, the scripts to generate scenes, chapters, and the complete video are provided. For example, in the `introduction` folder, you can find the scripts `scene.sh`, `chapter.sh`, and `video.sh`.

To generate a scene, you can use the `scene.sh` script, which takes a scene configuration file as an argument.

```bash
./scene.sh CH01/001/scene.json
```

After generating all the scenes for a chapter, you can use the `chapter.sh` script to compile them into a complete chapter video.

```bash
./chapter.sh CH01/chapter.json
```

To stitch all the chapters together into a complete video, you can use the `video.sh` script:

```bash
./video.sh video.json
```
