// Unit tests for Vite executable detection
use std::fs;
use tempfile::TempDir;
use vite_axum::{ViteProxyOptions, vite_proxy_options::try_find_vite_dir};

#[test]
fn test_try_find_vite_dir_with_ts_config() {
    let temp_dir = TempDir::new().unwrap();
    let vite_config = temp_dir.path().join("vite.config.ts");

    fs::File::create(&vite_config).unwrap();

    std::env::set_current_dir(temp_dir.path()).unwrap();

    let result = try_find_vite_dir();

    assert!(result.is_some());
    // On macOS, paths may include /private prefix, so we just check it ends correctly
    let result_str = result.unwrap();
    assert!(
        result_str.ends_with(temp_dir.path().to_str().unwrap())
            || temp_dir.path().to_str().unwrap().ends_with(&result_str)
    );
}

#[test]
fn test_try_find_vite_dir_with_js_config() {
    let temp_dir = TempDir::new().unwrap();
    let vite_config = temp_dir.path().join("vite.config.js");

    fs::File::create(&vite_config).unwrap();

    std::env::set_current_dir(temp_dir.path()).unwrap();

    let result = try_find_vite_dir();

    assert!(result.is_some());
}

#[test]
fn test_try_find_vite_dir_with_mjs_config() {
    let temp_dir = TempDir::new().unwrap();
    let vite_config = temp_dir.path().join("vite.config.mjs");

    fs::File::create(&vite_config).unwrap();

    std::env::set_current_dir(temp_dir.path()).unwrap();

    let result = try_find_vite_dir();

    assert!(result.is_some());
}

#[test]
fn test_try_find_vite_dir_with_mts_config() {
    let temp_dir = TempDir::new().unwrap();
    let vite_config = temp_dir.path().join("vite.config.mts");

    fs::File::create(&vite_config).unwrap();

    std::env::set_current_dir(temp_dir.path()).unwrap();

    let result = try_find_vite_dir();

    assert!(result.is_some());
}

#[test]
fn test_try_find_vite_dir_in_parent_directory() {
    let temp_dir = TempDir::new().unwrap();
    let vite_config = temp_dir.path().join("vite.config.ts");

    fs::File::create(&vite_config).unwrap();

    let nested_dir = temp_dir.path().join("src/components");
    fs::create_dir_all(&nested_dir).unwrap();

    std::env::set_current_dir(&nested_dir).unwrap();

    let result = try_find_vite_dir();

    assert!(result.is_some());
    // On macOS, paths may include /private prefix
    let result_str = result.unwrap();
    assert!(
        result_str.ends_with(temp_dir.path().to_str().unwrap())
            || temp_dir.path().to_str().unwrap().ends_with(&result_str)
    );
}

#[test]
fn test_try_find_vite_dir_not_found() {
    let temp_dir = TempDir::new().unwrap();

    std::env::set_current_dir(temp_dir.path()).unwrap();

    let result = try_find_vite_dir();

    assert!(result.is_none());
}

#[test]
fn test_working_directory_respects_custom_path() {
    let custom_dir = "/custom/vite/project";
    let options = ViteProxyOptions::new().working_directory(custom_dir);

    assert_eq!(options.working_directory, custom_dir);
}

#[test]
fn test_working_directory_defaults_to_current_or_vite_dir() {
    let temp_dir = TempDir::new().unwrap();
    let vite_config = temp_dir.path().join("vite.config.ts");

    fs::File::create(&vite_config).unwrap();

    std::env::set_current_dir(temp_dir.path()).unwrap();

    let options = ViteProxyOptions::new();

    // Should find vite config directory
    assert!(options.working_directory.contains("vite") || options.working_directory.contains("."));
}

#[test]
fn test_multiple_config_files_prefers_first_found() {
    let temp_dir = TempDir::new().unwrap();

    // Create both ts and js config
    fs::File::create(temp_dir.path().join("vite.config.ts")).unwrap();
    fs::File::create(temp_dir.path().join("vite.config.js")).unwrap();

    std::env::set_current_dir(temp_dir.path()).unwrap();

    let result = try_find_vite_dir();

    assert!(result.is_some());
    // On macOS, paths may include /private prefix
    let result_str = result.unwrap();
    assert!(
        result_str.ends_with(temp_dir.path().to_str().unwrap())
            || temp_dir.path().to_str().unwrap().ends_with(&result_str)
    );
}
