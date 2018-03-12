package com.ms.msamg.aipadvisory.ui.service;

import javax.inject.Inject;
import javax.inject.Named;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.slf4j.Logger;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;

import io.swagger.annotations.Api;
import msjava.base.slf4j.ContextLogger;
import msjava.cxfutils.autoconf.experimental.annotation.transport.HTTPServerTransport;

@Api
@ConditionalOnProperty("aipadvisory.cache.enabled")
@HTTPServerTransport(name = "commonTransport", mapping = "/msamg.aip-advisory-portal-ui/services/cacheService")
@Named
@Path("/")
@Produces(MediaType.APPLICATION_JSON)
public class CacheService {

	private static final Logger LOGGER = ContextLogger.safeLogger();

	@Inject
	private CacheManager cacheManager;

	@GET
	@Path("/clear")
	public String clearAll() {
		cacheManager.getCacheNames().stream().map(cacheManager::getCache).forEach(Cache::clear);
		LOGGER.info("All caches cleared...");
		return "{\"success\": true}";
	}
}
