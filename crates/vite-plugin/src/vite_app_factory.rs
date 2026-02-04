/**
 * Portions of this file are based on code from Vite Actix by Drew Chase.
 * Vite Actix is a library designed to enable seamless integration of the
 * Vite development server with the Actix web framework
 *
 * Vite Actix licensed under GNU General Public License v3.0.
 * @see: https://github.com/Drew-Chase/vite-actix/blob/master/LICENSE
 *
 * Ported to Axum framework
 */
use crate::proxy_to_vite;
use crate::ViteProxyState;
use axum::routing::get;
use axum::Router;

pub trait ViteAppFactory {
    fn configure_vite(self, state: ViteProxyState) -> Self;
}

impl ViteAppFactory for Router {
    fn configure_vite(self, state: ViteProxyState) -> Self {
        if cfg!(debug_assertions) {
            self.route("/{file:.*}", get(proxy_to_vite))
                .route("/node_modules/{file:.*}", get(proxy_to_vite))
                .with_state(state)
        } else {
            self
        }
    }
}
