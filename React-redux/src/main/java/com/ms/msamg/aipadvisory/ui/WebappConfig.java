package com.ms.msamg.aipadvisory.ui;

import org.springframework.boot.autoconfigure.EnableSelectiveAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

/**
 * Spring configuration used when deploying the application in a servlet
 * container.
 */
@ComponentScan(basePackages = "com.ms.msamg.aipadvisory.ui")
@Configuration
@EnableSelectiveAutoConfiguration
public class WebappConfig {
}
