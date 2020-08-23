/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

/* exported init */
const {St, Clutter} = imports.gi;
const Main = imports.ui.main;
const Util = imports.misc.util;
const GLib = imports.gi.GLib;
const ByteArray = imports.byteArray;
const Gio = imports.gi.Gio;

const POWER_ON = 0;
const POWER_OFF = 1;

var panelButton, panelButtonText;
var currentState;

const disableArgs = ["/home/nicolo/disable-wireless-mouse.sh"];
const enableArgs = ["/home/nicolo/enable-wireless-mouse.sh"];

function _execCommand(args) {
    try {
        let proc = Gio.Subprocess.new(
            ['pkexec'].concat(args),
            Gio.SubprocessFlags.STDOUT_PIPE | Gio.SubprocessFlags.STDERR_PIPE);
        proc.communicate_utf8_async(null, null, (proc, res) => {
            try {
                let [, stdout, stderr] = proc.communicate_utf8_finish(res);

                if(!proc.get_successful()){
                    throw new Error(stderr);
                }
                log(stdout);
            }catch(e){
                logError(e);
            }
        });
    }catch (e){
        logError(e);
    }
}

function _enableMouse (){
    //global.log("_enable");
    _execCommand(enableArgs);
}
function _disableMouse () {
    //global.log("_disable");
    _execCommand(disableArgs);
}

function _toggle () {
    //global.log("toggle");
    if(currentState == POWER_OFF){
        _enableMouse();
        currentState = POWER_ON;
        panelButtonText.set_text("Disable");

    }else{
        _disableMouse();
        currentState = POWER_OFF;
        panelButtonText.set_text("Enable");
    }
}

function init () {
    let [ok, out, err, exit] = GLib.spawn_command_line_sync('cat /sys/bus/usb/devices/1-2/power/control');

    let showText = "";
    global.log(ByteArray.toString(out).includes('on'));
    global.log(ByteArray.toString(out).includes('auto'))
    if(ByteArray.toString(out).includes('on')){
        //battery saving off
        showText = "Disable";
        currentState = POWER_ON;
    } else if(ByteArray.toString(out).includes('auto')){
        showText = "Enable";
        currentState = POWER_OFF;
    }


    panelButton = new St.Bin({
        style_class: "panel-button",
        can_focus: true,
        track_hover: true,
        x_fill: true,
        y_fill: false,
        reactive: true
    });
    panelButtonText = new St.Label({
        text: showText,
        y_align: Clutter.ActorAlign.CENTER,
    });
    panelButton.set_child(panelButtonText);
    panelButton.connect('button-press-event', () => {
        _toggle();
    });
}

function enable() {
    Main.panel._rightBox.insert_child_at_index(this.panelButton, 0);
}

function disable() {
    Main.panel._rightBox.remove_child(this.panelButton);
}
