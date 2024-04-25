## WLED Ledmap.json Generator

Try it here: <a href="https://intrinsically-sublime.github.io/WLED-Ledmap.json-Generator/">WLED-Ledmap.json-Generator<br></a>

### Other versions
WLED 2d-gap.json https://intrinsically-sublime.github.io/WLED-2D-gaps.json-Generator/

FastLED XY remapper https://intrinsically-sublime.github.io/FastLED-XY-Map-Generator/

### About
* Normal mode remaps the unchecked pixels in the array to -1 or the end of the array depending on the discard pixel setting.
  * Normal mode uses all the other options
* Two mapping modes available. Map the LED# to the GRID# or Map the GRID# to the LED#
  * If one doesn't work try the other?
* ~~Freestyle mode ignores all options and allows you to select the pixels in any order you wish.~~
  * ~~To undo a mistake you must retrace your steps backwards.~~

### How to use

<ol>
  <li>Configure the array by setting the maximum x and y dimensions and click Rebuild.<br>
  <li>Click the LEDs to edit the shape of the array by enabling, disabling or hiding pixels.<br>
  <li>Download the resulting "ledmap.json" file and upload it to your device via http://yourdeviceip/edit (does not work in AP mode)<br>
</ol>

Based on<a href="https://github.com/Intrinsically-Sublime/FastLED-XY-Map-Generator"> XY-Map-Generator</a> by Intrinsically-Sublime
which is based on<a href="https://github.com/macetech/FastLED-XY-Map-Generator"> XY-Map-Generator</a> by Garrett Mace

![Screenshot](https://github.com/Intrinsically-Sublime/WLED-Ledmap.json-Generator/blob/main/wled-ledmap-generator_screenshot.png)
