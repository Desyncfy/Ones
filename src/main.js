/* main.js
 *
 * Copyright 2024 Desync
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import GObject from 'gi://GObject';
import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk?version=4.0';
import Adw from 'gi://Adw?version=1';
import GLib from 'gi://GLib';


import { OnesWindow } from './window.js';

pkg.initGettext();
pkg.initFormat();

export const OnesApplication = GObject.registerClass(
    class OnesApplication extends Adw.Application {
        constructor() {
            super({application_id: 'xyz.desyncd.Ones', flags: Gio.ApplicationFlags.DEFAULT_FLAGS});

            const quit_action = new Gio.SimpleAction({name: 'quit'});
                quit_action.connect('activate', action => {
                this.quit();
            });
            this.add_action(quit_action);
            this.set_accels_for_action('app.quit', ['<primary>q']);

            const show_about_action = new Gio.SimpleAction({name: 'about'});
            show_about_action.connect('activate', action => {
                let aboutParams = {
                    application_name: '1.0.0',
                    application_icon: 'xyz.desyncd.Ones',
                    developer_name: 'Desync',
                    version: '1.0.0',
                    developers: [
                        'Desync'
                    ],
                    // Translators: Replace "translator-credits" with your name/username, and optionally an email or URL.
                    translator_credits: _("translator-credits"),
                    copyright: '© 2024 Desync'
                };
                const aboutDialog = new Adw.AboutDialog(aboutParams);
                aboutDialog.present(this.active_window);
            });
            this.add_action(show_about_action);
        }

        vfunc_activate() {
            let {active_window} = this;

            if (!active_window)
                active_window = new OnesWindow(this);

            active_window.present();
        }
    }
);

export function main(argv) {
    const application = new OnesApplication();
    return application.runAsync(argv);
}

// Logic
function toBinary() {
  const text = workbench.builder.get_object("Ascii").text;
  let output = "";
  for (let i = 0; i < text.length; i++) {
    output += text[i].charCodeAt(0).toString(2) + " ";
  }
  workbench.builder.get_object("Binary").text = output;
  workbench.builder.get_object("Ascii").text = "";
}

function toText() {
  let output = workbench.builder
    .get_object("Binary")
    .text.split(" ")
    .map((bin) => String.fromCharCode(parseInt(bin, 2)))
    .join("");
  workbench.builder.get_object("Ascii").text = output;
  workbench.builder.get_object("Binary").text = "";
}

const textButton = workbench.builder.get_object("AsciiButton");
const binaryButton = workbench.builder.get_object("BinaryButton");

textButton.connect_after("clicked", toBinary);
binaryButton.connect_after("clicked", toText);
