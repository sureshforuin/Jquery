package com.ms.msamg.aipadvisory.ui.service;

import java.io.IOException;
import java.security.Principal;
import java.util.Arrays;

import javax.inject.Named;

import org.apache.http.HttpHost;
import org.apache.http.HttpRequest;
import org.apache.http.auth.AuthSchemeProvider;
import org.apache.http.auth.AuthScope;
import org.apache.http.auth.Credentials;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.CredentialsProvider;
import org.apache.http.client.config.AuthSchemes;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.config.Lookup;
import org.apache.http.config.RegistryBuilder;
import org.apache.http.conn.ClientConnectionManager;
import org.apache.http.impl.auth.SPNegoSchemeFactory;
import org.apache.http.impl.client.BasicCredentialsProvider;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.params.HttpParams;
import org.apache.http.protocol.HttpContext;

/**
 * Custom SPNEGO Client implementation based on examples found on
 * http://wiki.ms.com/WebApplications/WebInfraJavaAPI
 *
 */
@Named
public class SpnegoClient extends CloseableHttpClient {

    private CloseableHttpClient httpClient;

    public SpnegoClient() throws Exception {

        // Put together configuration for SPNEGO Authentication
        RequestConfig config = RequestConfig.custom()
                .setExpectContinueEnabled(true)
                .setAuthenticationEnabled(true)
                .setTargetPreferredAuthSchemes(Arrays.asList(AuthSchemes.SPNEGO))
                .build();

        Credentials credentials = new Credentials() {
            public String getPassword() { return null; }
            public Principal getUserPrincipal() { return null; }
        };
        CredentialsProvider credentialsProvider = new BasicCredentialsProvider();
        credentialsProvider.setCredentials(new AuthScope(null,-1,null), credentials);

        // Get SPNEGO Authentication Scheme Provider
        SPNegoSchemeFactory spns = new SPNegoSchemeFactory(true);
        Lookup<AuthSchemeProvider> providers = RegistryBuilder.<AuthSchemeProvider>create()
                .register(AuthSchemes.SPNEGO, spns)
                .build();

        // Hostname verification is switched off for SSL, reason being that if canonical hostname is used, which is
        // required for the Kerberized HTTP connection, the canonical hostname gets checked in the SSL certificate
        // resulting in hostname verification exception as the RPDD System's SSL certificate does not contain its
        // canonical hostname.

        // Create HTTP Client using SPNEGO HTTP and SSL
        httpClient = HttpClients.custom()
                .setDefaultRequestConfig(config)
                .setDefaultCredentialsProvider(credentialsProvider)
                .setDefaultAuthSchemeRegistry(providers)
                .build();
    }

    @Override
    public HttpParams getParams() {
        return httpClient.getParams();
    }

    @Override
    public ClientConnectionManager getConnectionManager() {
        return httpClient.getConnectionManager();
    }

    @Override
    public void close() throws IOException {
        httpClient.close();
    }

    @Override
    protected CloseableHttpResponse doExecute(HttpHost target, HttpRequest request, HttpContext context)
            throws IOException, ClientProtocolException {
        return httpClient.execute(target, request, context);
    }

	public CloseableHttpClient getHttpClient() {
		return httpClient;
	}

	public void setHttpClient(CloseableHttpClient httpClient) {
		this.httpClient = httpClient;
	}

}