use crate::config::{ConfigItem, redact_sensitive};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MailerConfig {
    #[serde(default)]
    pub from_email: String,
    #[serde(default)]
    pub from_name: String,
    #[serde(default)]
    pub smtp_host: String,
    #[serde(default)]
    pub smtp_port: u16,
    #[serde(default)]
    pub smtp_username: String,
    #[serde(default)]
    pub smtp_password: String,
    #[serde(default = "default_smtp_secure")]
    pub smtp_secure: bool,
}

impl Default for MailerConfig {
    fn default() -> Self {
        Self {
            from_email: default_from_email(),
            from_name: default_from_name(),
            smtp_host: default_smtp_host(),
            smtp_port: default_smtp_port(),
            smtp_username: default_smtp_username(),
            smtp_password: default_smtp_password(),
            smtp_secure: default_smtp_secure(),
        }
    }
}

impl MailerConfig {
    pub fn add_to_debug(&self, items: &mut Vec<ConfigItem>) {
        items.push(ConfigItem {
            section: "Mailer".to_string(),
            key: "From Email".to_string(),
            value: self.from_email.clone(),
        });
        items.push(ConfigItem {
            section: "Mailer".to_string(),
            key: "From Name".to_string(),
            value: self.from_name.clone(),
        });
        items.push(ConfigItem {
            section: "Mailer".to_string(),
            key: "SMTP Host".to_string(),
            value: self.smtp_host.clone(),
        });
        items.push(ConfigItem {
            section: "Mailer".to_string(),
            key: "SMTP Port".to_string(),
            value: self.smtp_port.to_string(),
        });
        items.push(ConfigItem {
            section: "Mailer".to_string(),
            key: "SMTP Username".to_string(),
            value: self.smtp_username.clone(),
        });
        items.push(ConfigItem {
            section: "Mailer".to_string(),
            key: "SMTP Password".to_string(),
            value: redact_sensitive(&self.smtp_password),
        });
        items.push(ConfigItem {
            section: "Mailer".to_string(),
            key: "SMTP Secure".to_string(),
            value: self.smtp_secure.to_string(),
        });
    }
}

fn default_from_email() -> String {
    "noreply@example.com".to_string()
}

fn default_from_name() -> String {
    "Sorai".to_string()
}

fn default_smtp_host() -> String {
    "localhost".to_string()
}

fn default_smtp_port() -> u16 {
    587
}

fn default_smtp_username() -> String {
    String::new()
}

fn default_smtp_password() -> String {
    String::new()
}

fn default_smtp_secure() -> bool {
    true
}
