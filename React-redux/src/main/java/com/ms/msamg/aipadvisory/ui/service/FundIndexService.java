package com.ms.msamg.aipadvisory.ui.service;

import java.nio.file.Paths;

import javax.inject.Inject;
import javax.inject.Named;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.ms.msamg.aipadvisory.ui.data.Store;

import io.swagger.annotations.Api;
import msjava.cxfutils.autoconf.experimental.annotation.transport.HTTPServerTransport;

@Api
@HTTPServerTransport(name = "commonTransport", mapping = "/msamg.aip-advisory-portal-ui/services/fundIndexService")
@Named
@Path("/")
@Produces(MediaType.APPLICATION_JSON)
public class FundIndexService {

	@Inject
	private Store store;

	@GET
	@Path("/")
	public String getFunds() {
		return store.getDataAsString(Paths.get(store.getRootLocation(), "funds", "fundIndex.json"));
	}

}
