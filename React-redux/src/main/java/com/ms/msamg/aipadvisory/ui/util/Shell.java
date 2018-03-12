package com.ms.msamg.aipadvisory.ui.util;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.io.Writer;

import javax.inject.Named;

import org.slf4j.Logger;

import msjava.base.slf4j.ContextLogger;

@Named
public class Shell {

	private static final Logger LOGGER = ContextLogger.safeLogger();

	public String execute(String command) {
		Writer sw = new StringWriter();
		try (PrintWriter wr = new PrintWriter(sw)) {
			try {
				Process process = Runtime.getRuntime().exec(command);
				InputStream ins = new BufferedInputStream(process.getInputStream());

				try (BufferedReader br = new BufferedReader(new InputStreamReader(ins))) {
					for (String line = br.readLine(); line != null; line = br.readLine()) {
						wr.println(line);
					}
				}

			} catch (IOException ouch) {
				LOGGER.error("Exception: {}", ouch);
				ouch.printStackTrace(wr);
			}

			return sw.toString();
		}
	}

}
