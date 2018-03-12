package com.ms.msamg.aipadvisory.ui;

import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.web.SpringServletContainerInitializer;

import msjava.base.autoconf.experimental.AutoconfServletInitializer;

/**
 * Web application initializer class, executed on servlet container startup by
 * {@link SpringServletContainerInitializer}.
 */
public class WebappInit extends AutoconfServletInitializer {

	@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
		return application.sources(WebappConfig.class);
	}

}
