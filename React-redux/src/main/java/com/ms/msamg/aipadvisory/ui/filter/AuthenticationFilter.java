package com.ms.msamg.aipadvisory.ui.filter;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.springframework.web.filter.GenericFilterBean;

import com.ms.msamg.aipadvisory.ui.util.Authenticator;

import msjava.base.slf4j.ContextLogger;

public class AuthenticationFilter extends GenericFilterBean {

	private static final Logger LOGGER = ContextLogger.safeLogger();

	private static final String NOT_AUTHENTICATED = "(not authenticated)";

	@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
			throws IOException, ServletException {
		HttpServletRequest httpRequest = (HttpServletRequest) request;
		String requestUri = httpRequest.getRequestURI();
		String authUser = Authenticator.getAuthUser(httpRequest);
		if (authUser == null) {
			LOGGER.warn("User: {} => Request URI: {}", NOT_AUTHENTICATED, requestUri);
		}

		LOGGER.info("User: {} => Request URI: {}", authUser, requestUri);
		chain.doFilter(request, response);
	}

}
