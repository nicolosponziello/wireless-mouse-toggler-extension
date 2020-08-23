const GLib = imports.gi.GLib;
const Gtk = imports.gi.Gtk;
const GObject = imports.gi.GObject;
const Gio = imports.gi.Gio;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

var prefs = {
    enablePath: "",
    disablePath: ""
}
var settings;

function getSettings () {
    let GioSSS = Gio.SettingsSchemaSource;
    let schemaSrc = GioSSS.new_from_directory(Me.dir.get_child("schemas").get_path(),
                                                GioSSS.get_default(),
                                                false);
    let schemaObj = schemaSrc.lookup('org.gnome.shell.extensions.mouse', true);
    if(!schemaObj){
        throw new Error("schema not found");
    }

    return new Gio.Settings({settings_schema: schemaObj});
}

function savePrefs () {
    settings.set_string('enable-path', prefs.enablePath);
    settings.set_string('disable-path', prefs.disablePath);
}

function init(){
    log(`init Prefs`);
    settings = getSettings();

    let enablePath = settings.get_string('enable-path').toString();
    let disablePath = settings.get_string('disable-path').toString();

    prefs.enablePath = enablePath;
    prefs.disablePath = disablePath;
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
        enablePathInput.set_text(prefs.enablePath);
        enablePathInput.connect('changed', () => {
            prefs.enablePath = enablePathInput.get_text();
        });


        let disablePathLabel = new Gtk.Label({
            label: "Disable script paths"
        });

        let disablePathInput = new Gtk.Entry();
        disablePathInput.set_text(prefs.disablePath);
        disablePathInput.connect('changed', () => {
            prefs.disablePath = disablePathInput.get_text();
        });

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

        saveBtn.connect('clicked', () => savePrefs());

        this.add(enableBox);
        this.add(disableBox);
        this.add(saveBox);
    }
})