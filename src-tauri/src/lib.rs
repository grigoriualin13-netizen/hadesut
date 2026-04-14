use tauri::{Manager, Emitter};
use tauri::menu::{MenuBuilder, SubmenuBuilder, MenuItemBuilder};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .setup(|app| {
            // Build native menu
            let file_menu = SubmenuBuilder::new(app, "Fișier")
                .item(&MenuItemBuilder::with_id("new", "Proiect Nou").accelerator("CmdOrCtrl+N").build(app)?)
                .separator()
                .item(&MenuItemBuilder::with_id("open", "Deschide Proiect...").accelerator("CmdOrCtrl+O").build(app)?)
                .item(&MenuItemBuilder::with_id("save", "Salvează").accelerator("CmdOrCtrl+S").build(app)?)
                .item(&MenuItemBuilder::with_id("save_as", "Salvează Ca...").accelerator("CmdOrCtrl+Shift+S").build(app)?)
                .separator()
                .item(&MenuItemBuilder::with_id("export_png", "Export PNG").build(app)?)
                .item(&MenuItemBuilder::with_id("export_svg", "Export SVG").build(app)?)
                .item(&MenuItemBuilder::with_id("export_pdf", "Export PDF Vector").build(app)?)
                .item(&MenuItemBuilder::with_id("export_dxf", "Export DXF (AutoCAD)").build(app)?)
                .separator()
                .item(&MenuItemBuilder::with_id("quit", "Ieșire").accelerator("Alt+F4").build(app)?)
                .build()?;

            let edit_menu = SubmenuBuilder::new(app, "Editare")
                .item(&MenuItemBuilder::with_id("undo", "Anulare").accelerator("CmdOrCtrl+Z").build(app)?)
                .item(&MenuItemBuilder::with_id("redo", "Refacere").accelerator("CmdOrCtrl+Y").build(app)?)
                .separator()
                .item(&MenuItemBuilder::with_id("copy", "Copiază").accelerator("CmdOrCtrl+C").build(app)?)
                .item(&MenuItemBuilder::with_id("paste", "Lipește").accelerator("CmdOrCtrl+V").build(app)?)
                .item(&MenuItemBuilder::with_id("delete", "Șterge").accelerator("Delete").build(app)?)
                .separator()
                .item(&MenuItemBuilder::with_id("select_all", "Selectează Tot").accelerator("CmdOrCtrl+A").build(app)?)
                .build()?;

            let view_menu = SubmenuBuilder::new(app, "Vizualizare")
                .item(&MenuItemBuilder::with_id("zoom_in", "Mărește").accelerator("CmdOrCtrl+=").build(app)?)
                .item(&MenuItemBuilder::with_id("zoom_out", "Micșorează").accelerator("CmdOrCtrl+-").build(app)?)
                .item(&MenuItemBuilder::with_id("zoom_reset", "Zoom 100%").accelerator("CmdOrCtrl+0").build(app)?)
                .separator()
                .item(&MenuItemBuilder::with_id("toggle_snap", "SNAP On/Off").build(app)?)
                .item(&MenuItemBuilder::with_id("toggle_ortho", "ORTO On/Off").build(app)?)
                .separator()
                .item(&MenuItemBuilder::with_id("toggle_legend", "Legendă").build(app)?)
                .item(&MenuItemBuilder::with_id("toggle_theme", "Schimbă Tema").build(app)?)
                .build()?;

            let tools_menu = SubmenuBuilder::new(app, "Instrumente")
                .item(&MenuItemBuilder::with_id("tool_select", "Selectare (S)").build(app)?)
                .item(&MenuItemBuilder::with_id("tool_cable", "Cablu (C)").build(app)?)
                .separator()
                .item(&MenuItemBuilder::with_id("generator", "Generator Automat").build(app)?)
                .item(&MenuItemBuilder::with_id("voltage_drop", "Căderi de Tensiune").build(app)?)
                .item(&MenuItemBuilder::with_id("flow_anim", "Animație Flux").build(app)?)
                .separator()
                .item(&MenuItemBuilder::with_id("bg_setup", "Fundal Cadastral").build(app)?)
                .build()?;

            let help_menu = SubmenuBuilder::new(app, "Ajutor")
                .item(&MenuItemBuilder::with_id("about", "Despre ElectroCAD Pro").build(app)?)
                .build()?;

            let menu = MenuBuilder::new(app)
                .item(&file_menu)
                .item(&edit_menu)
                .item(&view_menu)
                .item(&tools_menu)
                .item(&help_menu)
                .build()?;

            app.set_menu(menu)?;

            // Handle menu events
            app.on_menu_event(move |app_handle, event| {
                let window = app_handle.get_webview_window("main").unwrap();
                let id = event.id().0.as_str();
                match id {
                    "quit" => { std::process::exit(0); }
                    "about" => {
                        let _ = window.emit("menu-event", "about");
                    }
                    _ => {
                        let _ = window.emit("menu-event", id);
                    }
                }
            });

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
