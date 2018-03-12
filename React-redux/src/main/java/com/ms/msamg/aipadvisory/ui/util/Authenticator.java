package com.ms.msamg.aipadvisory.ui.util;

import javax.servlet.http.HttpServletRequest;

public class Authenticator {

	private static final String AUTH_USER = "auth_user";

	private static final String CONFIG_MODE = "CONFIG_MODE";

	private static final String USERNAME = "username";

	private static final String WINDEV = "windev";

	public static String getAuthUser(HttpServletRequest request) {
		String authUser = request.getHeader(AUTH_USER);
		if (authUser == null && WINDEV.equalsIgnoreCase(System.getProperty(CONFIG_MODE))) {
			authUser = System.getenv(USERNAME);
		}

		return authUser;
	}

}
