package com.ms.msamg.aipadvisory.ui.service;

import javax.inject.Named;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import org.slf4j.Logger;

import com.ms.msamg.aipadvisory.model.Ping;
import com.ms.msamg.aipadvisory.ui.util.Authenticator;

import io.swagger.annotations.Api;
import msjava.base.slf4j.ContextLogger;
import msjava.cxfutils.autoconf.experimental.annotation.transport.HTTPServerTransport;

@Api
@HTTPServerTransport(name = "commonTransport", mapping = "/msamg.aip-advisory-portal-ui/services/pingService")
@Named
@Path("/")
@Produces(MediaType.APPLICATION_JSON)
public class PingService {

	private static final Logger LOGGER = ContextLogger.safeLogger();

	private Ping getPing(@Context HttpServletRequest request, String message) {
		String authenticationPrincipal = Authenticator.getAuthUser(request);

		Ping ping = new Ping();
		ping.setMessage(message);
		ping.setUser(authenticationPrincipal);
		return ping;
	}

	@GET
	@Path("ping/{message}")
	public Ping getPingFromPath(@Context HttpServletRequest request, @PathParam("message") String message) {
		LOGGER.info("Received ping request with message as path param: '{}'", message);
		return getPing(request, message);
	}

	@GET
	@Path("ping")
	public Ping getPingFromQuery(@Context HttpServletRequest request,
			@DefaultValue("pong") @QueryParam("message") String message) {
		LOGGER.info("Received ping request with message as query param: '{}'", message);
		return getPing(request, message);
	}

}
