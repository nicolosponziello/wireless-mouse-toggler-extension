# Wireless Mouse toggler GNOME Extension

This extension places a button on the right end of the GNOME panel that allows to control the power status of the usb port where is plugged the wireless receiver of the mouse.

THIS EXTENSION IS DESIGNED FOR PERSONAL USE. YOU ARE FREE TO FORK AND DO YOUR MODIFICATION.

As of now, by default it reads ```/sys/bus/usb/devices/1-2/power/control``` to check at startup the current setting.

## Installation
Place the folder inside ```.local/share/gnome-shell/extensions/``` and use extension app to activate.

## Scripts
As of now, it uses 2 scripts placed inside home folder:
+ To disable: ```disable-wireless-mouse.sh```
+ To enable: ```enable-wireless-mouse.sh```

Both of these scripts need to start with
```bash
#!/usr/bin/bash
```

Inside this scripts place the command/s needed to control the power of the port. Use powertop to check which controls are avaiable and which command are required. 

## Useful commands

### To compile schema
```glib-compile-schemas ./schemas```

### To get gnome shell logs
```journactl -f -o cat /usr/bin/gnome-shell```

### Restart GNOME shell
```alt + f2 then r```