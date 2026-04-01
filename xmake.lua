set_project("rtc-lab")
set_xmakever("3.0.0")

set_languages("c++20")

add_rules("mode.debug", "mode.release", "mode.releasedbg")
add_rules("plugin.compile_commands.autoupdate")

set_warnings("allextra")
