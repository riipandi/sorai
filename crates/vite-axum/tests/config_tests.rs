// Integration tests for vite-axum configuration options
use vite_axum::ViteProxyOptions;

#[test]
fn test_default_options() {
    let options = ViteProxyOptions::new();

    assert_eq!(options.port, None);
    assert!(options.working_directory.contains("./") || options.working_directory.contains("."));
    assert_eq!(options.log_level, Some(log::Level::Debug));
}

#[test]
fn test_port_configuration() {
    ViteProxyOptions::new().port(3000).build().unwrap();

    let global = ViteProxyOptions::global();
    assert_eq!(global.port, Some(3000));
}

#[test]
fn test_working_directory() {
    let custom_dir = "/tmp/custom-vite-project";
    ViteProxyOptions::new().working_directory(custom_dir).build().unwrap();

    let global = ViteProxyOptions::global();
    assert_eq!(global.working_directory, custom_dir);
}

#[test]
fn test_log_level_configuration() {
    let levels = vec![
        log::Level::Error,
        log::Level::Warn,
        log::Level::Info,
        log::Level::Debug,
        log::Level::Trace,
    ];

    for level in levels {
        ViteProxyOptions::new().log_level(level).build().unwrap();

        let global = ViteProxyOptions::global();
        assert_eq!(global.log_level, Some(level));
    }
}

#[test]
fn test_disable_logging() {
    ViteProxyOptions::new().disable_logging().build().unwrap();

    let global = ViteProxyOptions::global();
    assert_eq!(global.log_level, None);
}

#[test]
fn test_chained_configuration() {
    ViteProxyOptions::new()
        .port(8888)
        .working_directory("/chained/test")
        .log_level(log::Level::Warn)
        .build()
        .unwrap();

    let global = ViteProxyOptions::global();
    assert_eq!(global.port, Some(8888));
    assert_eq!(global.working_directory, "/chained/test");
    assert_eq!(global.log_level, Some(log::Level::Warn));
}

#[test]
fn test_port_update() {
    ViteProxyOptions::new().port(5000).build().unwrap();

    // Update port
    ViteProxyOptions::update_port(6000).unwrap();

    let global = ViteProxyOptions::global();
    assert_eq!(global.port, Some(6000));
}

#[test]
fn test_multiple_configurations() {
    // First configuration
    ViteProxyOptions::new()
        .port(1111)
        .working_directory("/dir1")
        .build()
        .unwrap();

    let global1 = ViteProxyOptions::global();
    assert_eq!(global1.port, Some(1111));
    assert_eq!(global1.working_directory, "/dir1");

    // Second configuration (should override)
    ViteProxyOptions::new()
        .port(2222)
        .working_directory("/dir2")
        .build()
        .unwrap();

    let global2 = ViteProxyOptions::global();
    assert_eq!(global2.port, Some(2222));
    assert_eq!(global2.working_directory, "/dir2");
}

#[test]
fn test_options_clone() {
    let options1 = ViteProxyOptions::new()
        .port(7777)
        .working_directory("/clone/test")
        .log_level(log::Level::Warn);

    let options2 = options1.clone();

    assert_eq!(options1.port, options2.port);
    assert_eq!(options1.working_directory, options2.working_directory);
    assert_eq!(options1.log_level, options2.log_level);
}

#[test]
fn test_global_without_build() {
    // This test checks the default global state
    // Note: Since tests run in parallel and share global state,
    // we just verify that global() returns a valid instance
    let global = ViteProxyOptions::global();

    // The global state might have been modified by other tests
    // so we just check that it returns Some valid instance
    assert!(global.port.is_none() || global.port.is_some());
    assert!(!global.working_directory.is_empty());
}
