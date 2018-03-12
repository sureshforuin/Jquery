package com.ms.msamg.aipadvisory.ui.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.ehcache.EhCacheCacheManager;
import org.springframework.cache.ehcache.EhCacheManagerFactoryBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@ConditionalOnProperty("aipadvisory.cache.enabled")
@Configuration
@EnableCaching
public class CacheConfig {

	@Bean
	public CacheManager ehCacheCacheManager() {
		return new EhCacheCacheManager(ehCacheCacheManagerFactory().getObject());
	}

	@Bean
	public EhCacheManagerFactoryBean ehCacheCacheManagerFactory() {
		EhCacheManagerFactoryBean ehCacheManagerFactoryBean = new EhCacheManagerFactoryBean();
		ehCacheManagerFactoryBean.setShared(true);
		return ehCacheManagerFactoryBean;
	}

}
