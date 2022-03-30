extern crate cfg_if;
extern crate wasm_bindgen;
use web_sys::console;

mod utils;

use cfg_if::cfg_if;
use wasm_bindgen::prelude::*;

cfg_if! {
    if #[cfg(feature = "wee_alloc")] {
        extern crate wee_alloc;
        #[global_allocator]
        static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;
    }
}

#[wasm_bindgen]
pub fn greet(name: &str) {
    console::log_1(&JsValue::from_str(&format!("❤ ❌ Hello, {}!", name)));
}
