package com.ms.msamg.aipadvisory.ui.data;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;

import javax.inject.Named;

import org.apache.commons.lang3.StringUtils;
import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Value;

import com.ms.msamg.aipadvisory.ui.util.JSONUtils;

import msjava.base.slf4j.ContextLogger;

@Named
public class Store {

	private static final Logger LOGGER = ContextLogger.safeLogger();

	@Value("${aipadvisory.store.path}")
	private String rootLocation;

	public JSONObject getDataAsJSONObject(Path file) {
		return JSONUtils.parseJSON(getDataAsString(file));
	}

	public String getDataAsString(Path file) {
		try {
			return new String(Files.readAllBytes(file), StandardCharsets.UTF_8);

		} catch (IOException ouch) {
			LOGGER.error("IOException: {}", ouch);
			return StringUtils.EMPTY;
		}
	}

	public String getRootLocation() {
		return rootLocation;
	}
	
	public JSONObject mergeJSONObject(JSONObject json1, JSONObject json2) {
		
		JSONObject merged = new JSONObject();
		try {
			String[] names = JSONObject.getNames(json1);
			if (null==names) {
				merged = json2;
			} else if (null != names && names.length>0) {
				merged = new JSONObject(json1, names);
				String[] names2 = JSONObject.getNames(json2);
				if (null != names2 && names2.length>0) {
					for (String crunchifyKey : names2) {
						merged.put(crunchifyKey, json2.get(crunchifyKey));
					}
				}
			}
		} catch (JSONException oops) {
			LOGGER.error("JSONException: {}",oops);
			return merged;
		}
		return merged;
	}

}
