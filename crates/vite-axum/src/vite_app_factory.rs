// Copyright (c) 2025 Aris Ripandi <aris@duck.com>
//
// Portions of this file are based on Vite Actix by Drew Chase.
// Vite Actix is a library designed to enable seamless integration of the
// Vite development server with the Actix web framework.
//
// Vite Actix is licensed under GNU General Public License v3.0.
// @see: https://github.com/Drew-Chase/vite-actix
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program. If not, see <https://www.gnu.org/licenses/>.

use crate::proxy_to_vite;
use axum::{routing::get, Router};

pub fn create_vite_router() -> Router {
    Router::new()
        .route("/{file:.*}", get(proxy_to_vite))
        .route("/node_modules/{file:.*}", get(proxy_to_vite))
}
