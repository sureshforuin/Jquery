package com.ms.msamg.aipadvisory.ui.config;

import javax.inject.Inject;
import javax.servlet.Filter;

import org.springframework.beans.factory.config.AutowireCapableBeanFactory;
import org.springframework.boot.context.embedded.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.ms.msamg.aipadvisory.ui.filter.AuthenticationFilter;

@Configuration
public class TransportConfig {

	@Inject
	private AutowireCapableBeanFactory beanFactory;

	@Bean
	public FilterRegistrationBean myFilter() {
		FilterRegistrationBean registration = new FilterRegistrationBean();
		Filter authFilter = new AuthenticationFilter();
		beanFactory.autowireBean(authFilter);
		registration.setFilter(authFilter);
		// registration.addUrlPatterns("/services/*");
		return registration;
	}

}
