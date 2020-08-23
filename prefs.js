const GLib = imports.gi.GLib;
const Gtk = imports.gi.Gtk;
const GObject = imports.gi.GObject;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

function init(){
    log(`init Prefs`);
}

function buildPrefsWidget(){
    let widget = new PrefsWidget();

    widget.show_all();
    return widget;
}

const PrefsWidget = new GObject.Class({
    Name: "mouse.prefs",
    GTypeName: "PrefsWidget",
    Extends: Gtk.Box,

    _init: function(params){
        this.parent(params);

        this.margin = 20;
        this.set_spacing(15);
        this.set_orientation(Gtk.Orientation.VERTICAL);
        
        this.connect('destroy', Gtk.main_quit);

        let enablePathLabel = new Gtk.Label({
            label: "Enable script paths"
        });

        let enablePathInput = new Gtk.Entry();


        let disablePathLabel = new Gtk.Label({
            label: "Disable script paths"
        });

        let disablePathInput = new Gtk.Entry();

        let enableBox = new Gtk.Box();
        enableBox.set_orientation(Gtk.Orientation.HORIZONTAL);
        enableBox.pack_start(enablePathLabel, false, false, 0);
        enableBox.pack_end(enablePathInput, false, false, 0);


        let disableBox = new Gtk.Box();
        disableBox.set_orientation(Gtk.Orientation.HORIZONTAL);
        disableBox.pack_start(disablePathLabel, false, false, 0);
        disableBox.pack_end(disablePathInput, false, false, 0);

        let saveBox = new Gtk.Box();
        let saveBtn = new Gtk.Button({
            label: "Save"
        });
        saveBox.set_orientation(Gtk.Orientation.HORIZONTAL);
        saveBox.pack_end(saveBtn, false, false, 0);

        this.add(enableBox);
        this.add(disableBox);
        this.add(saveBox);
    }
})