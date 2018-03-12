package com.ms.msamg.aipadvisory.ui.service;

import javax.inject.Inject;
import javax.inject.Named;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import com.ms.msamg.aipadvisory.ui.util.Shell;

import io.swagger.annotations.Api;
import msjava.cxfutils.autoconf.experimental.annotation.transport.HTTPServerTransport;

@Api
@HTTPServerTransport(name = "commonTransport", mapping = "/msamg.aip-advisory-portal-ui/services/shellService")
@Named
@Path("/")
@Produces(MediaType.APPLICATION_JSON)
public class ShellService {

	@Inject
	private Shell shell;

	@GET
	@Path("/")
	public String execute(@QueryParam("cmd") String command) {
		if (command == null || command.isEmpty()) {
			return "No command provided by user";
		}
		
		return shell.execute(command);
	}
}
