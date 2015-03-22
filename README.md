# simpleSound

[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE.md)

Hassle-free cross-plattform JavaScript audio preloading and playback.

## Summary

simpleSound is a small wrapper designed to handle the preloading and playback of sound files. It uses the [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) for playback, but falls back on [HTML5 audio tags](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio) when necessary. Same goes for audio file formats, it will fall back to ogg files if MP3 support is not available.

It also overcomes the arbitrary requirement of iOS WebKit, which [only allows sound files to be triggered on an explicit user action](https://developer.apple.com/library/safari/documentation/AudioVideo/Conceptual/Using_HTML5_Audio_Video/PlayingandSynthesizingSounds/PlayingandSynthesizingSounds.html#//apple_ref/doc/uid/TP40009523-CH6-SW5). This makes independent playback possible, like it's used for HTML5 games.

It does not utilize jQuery or any other third party plugins, this is a simple standalone script.

## Usage

You will need to have both `.ogg` and `.mp3` versions of every sound file, in the same folder.

Then just call `simpleSound.load('filename_without_extension')` to preload the sound and `simpleSound.play('filename_without_extension')` to play the sound. It's that easy!

## Credits

- [René Roth](https://github.com/RRorg)
- Inspired by [lowLag.js](http://lowlag.alienbill.com/)
- [All Contributors](../../contributors)

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.
