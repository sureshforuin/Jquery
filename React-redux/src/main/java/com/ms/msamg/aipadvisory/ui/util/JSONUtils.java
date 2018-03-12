package com.ms.msamg.aipadvisory.ui.util;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;

import org.apache.commons.lang3.StringUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;

import com.fasterxml.jackson.databind.ObjectMapper;

import msjava.base.slf4j.ContextLogger;

public class JSONUtils {

	private static final Logger LOGGER = ContextLogger.safeLogger();

	private JSONUtils() {
	}

	public static final JSONObject EMPTY_OBJECT = new JSONObject("{}");
	
	public static JSONArray getAsJSONArray(JSONObject node, String key) {
		JSONArray returnValue = new JSONArray();
		if (!node.has(key)) {
			return returnValue;
		}
		
		Object valueObj = node.get(key);
		
		if (valueObj instanceof JSONArray) {
			returnValue = (JSONArray) valueObj;
		} else if (valueObj instanceof JSONObject) {
			returnValue.put((JSONObject) valueObj);
		}
		
		return returnValue;
	}

	public static boolean isValidJSONFile(Path filePath) {
		File file = filePath.toFile();
		if (!file.exists()) {
			LOGGER.error("File {} not found", file.getAbsolutePath());
			return false;
		}

		final ObjectMapper mapper = new ObjectMapper();
		try {
			String jsonString = new String(Files.readAllBytes(filePath));
			mapper.readTree(jsonString);
			return true;

		} catch (Exception ouch) {
			LOGGER.error("JSON Parsing or I/O exception encountered for file {}", file.getAbsolutePath());
			LOGGER.error("Exception: {}", ouch);
			return false;
		}
	}

	public static JSONObject parseJSON(String json) {
		try {
			return new JSONObject(json);

		} catch (JSONException ouch) {
			LOGGER.error(ouch.getMessage());
			return EMPTY_OBJECT;
		}
	}
	
	public static String standardizeFileName(String jsonFileName){
		
		if (null != jsonFileName) {
			jsonFileName = jsonFileName.trim();	
			if(jsonFileName.length() > 0) {
				 // Check for any : and replace with _
				jsonFileName = jsonFileName.replaceAll(":", "_");
				
				// Check for any / and replace with _
				jsonFileName = jsonFileName.replaceAll("/", "_");
				
				// Check for any / and replace with _
				jsonFileName = jsonFileName.replaceAll(" ", "_");
				
				// Check for multiple _ and replace with single _
				jsonFileName = jsonFileName.replaceAll("__", "_");
				
			}
		} 
		
	
		return jsonFileName;
	}
	
	public static String getDataAsString(Path file) {
		try {
			return new String(Files.readAllBytes(file), StandardCharsets.UTF_8);

		} catch (IOException ouch) {
			LOGGER.error("IOException: {}", ouch);
			return StringUtils.EMPTY;
		}
	}
	
	public static JSONObject mergeJSONObject(JSONObject json1, JSONObject json2) {
		
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
