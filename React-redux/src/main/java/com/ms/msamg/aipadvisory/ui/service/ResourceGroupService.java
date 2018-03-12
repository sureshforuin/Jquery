package com.ms.msamg.aipadvisory.ui.service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

import javax.inject.Inject;
import javax.inject.Named;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;

import com.ms.msamg.aipadvisory.ui.data.ResourceGroupStore;
import com.ms.msamg.aipadvisory.ui.util.Constants;
import com.ms.msamg.aipadvisory.util.JSONUtils;

import io.swagger.annotations.Api;
import msjava.base.slf4j.ContextLogger;
import msjava.cxfutils.autoconf.experimental.annotation.transport.HTTPServerTransport;

@Api
@HTTPServerTransport(name = "commonTransport", mapping = "/msamg.aip-advisory-portal-ui/services/resourceGroupService") // resourceGroupService")
@Named
@Path("/")
@Produces(MediaType.APPLICATION_JSON)
public class ResourceGroupService {

	private static final Logger LOGGER = ContextLogger.safeLogger();

	@Inject
	private ResourceGroupStore resourceGroupStore;

	@GET
	@Path("{userId}")
	public String getResourceGroups(@PathParam("userId") String userId) {
		return resourceGroupStore.getResourceGroups(userId);
	}

	@GET
	@Path("{entityId}/approachTwo/{resourceGroup}")
	public String getResouceGroupTab(@PathParam("entityId") String entityId,
			@PathParam("resourceGroup") String resourceGroup, @QueryParam("effectiveDate") String effectiveDateStr) { // @PathParam("resourceGroup")
																														// String
																														// resourceGroup){
		long start = System.nanoTime();
		JSONObject jsonData = resourceGroupStore.getResourceGroupJSON(entityId, resourceGroup);
		String jsonDataStr = getJsonForEffectiveDate(effectiveDateStr, jsonData);

		LOGGER.info("Time taken to process JSON from store in approach two = {} ms",
				(System.nanoTime() - start) / 1_000_000.0);
		return jsonDataStr;
	}

	private String getJsonForEffectiveDate(String effectiveDateStr, JSONObject jsonData) {
		if (effectiveDateStr == null || effectiveDateStr.trim().length() <= 0) {
			effectiveDateStr = LocalDate.now().format(DateTimeFormatter.ofPattern(Constants.MM_DD_YYYY));
		}

		LocalDate effectiveDate = LocalDate.parse(effectiveDateStr, DateTimeFormatter.ofPattern(Constants.MM_DD_YYYY));

		Set<String> keys = jsonData.keySet();
		Set<String> ignoreKeys = new HashSet<>(Arrays.asList(Constants.TIME_FRAMES, Constants.BLOCKS,
				Constants.FUND_STRUCTURE, Constants.SUBSCRIPTON, Constants.FUND_OVERVIEW, Constants.FUND_HIGHLIGHTS,
				Constants.FUND_AUM_TABLE, Constants.STRATEGY_AUM_TABLE, Constants.MANAGEMENT_COMPANY_AUM_TABLE,
				Constants.SERVICE_PROVIDER_OVERVIEW, Constants.MARKET_BENCHMARK, Constants.KEY_STATS,
				Constants.HEDGE_FUND_BENCHMARK, Constants.RATINGS_OVERVIEW, Constants.SHARE_CLASS,
				Constants.RUNUPS_AND_DRAWDOWN, Constants.RUNUP_MARKET_TABLE, Constants.RUNUPS_AND_DRAWDOWN_FUND,
				Constants.RUNUPS_AND_DRAWDOWN_MARKET, Constants.DRAWDOWN_FUND_TABLE, Constants.RUNUP_FUND_TABLE,
				Constants.RUNUPS_AND_DRAWDOWN, Constants.DRAWDOWN_MARKET_TABLE, Constants.MOST_POSITIVELY_SIMILAR,
				Constants.MOST_DISSIMILAR, "AnalysisCorrelationsTabGroup", "CorrelationsFundTab", "data",
				"CorrelationsAlphaTab", "CorrelationsFundCharts", "CorrelationsAlphaCharts", "UpDownCapture", "Regressions",
				"UpDownBeta" , "links" ,"RollingAlpha" , "RollingFit" , "Bench1Regression" , "Bench1Rolling&Confidence" , "Bench2Regression" , "Bench2Rolling&Confidence" , "MarketTiming" , "regressionModelling"));

		Set<String> fundTableKeys = new HashSet<>(Arrays.asList(Constants.STYLE, Constants.AUM, Constants.STRUCTURE,
				Constants.DOMICILE, Constants.AUDITOR, Constants.ADMINISTRATOR, Constants.DOMICILE,
				Constants.GEOGRAPHICFOCUS, Constants.INVMGTCO, Constants.ANNUALIZED_STATS));
		JSONObject resultJSONData = new JSONObject();

		/*
		 * for (String key : keys) { if (key.equals("calendarControl")) {
		 * ignoreKeys.add(key); } else { if (jsonData.get(key) instanceof
		 * JSONObject || jsonData.get(key) instanceof JSONArray) { JSONArray
		 * sectionJsonObj = (JSONArray) jsonData.get(key); for (Object jsonObj :
		 * sectionJsonObj) { if (jsonObj instanceof String) { } else {
		 * JSONObject jsonItem = (JSONObject) jsonObj; if
		 * (!jsonItem.has(Constants.TIME_FRAME)) { ignoreKeys.add(key);
		 * 
		 * } }
		 * 
		 * } } }
		 * 
		 * }
		 */

		for (String key : keys) {
			try {
				if (ignoreKeys.contains(key)) {
					resultJSONData.put(key, jsonData.get(key));
					continue;
				}

				if (fundTableKeys.contains(key)) {
					resultJSONData.put(key, jsonData.get(key));
					continue;
				}

				// Object sectionObj = ;
				/*
				 * if (jsonData.get(key) instanceof JSONObject) { JSONObject
				 * sectionJsonObj = (JSONObject) jsonData.get(key); if
				 * (!sectionJsonObj.has(Constants.TIME_FRAME)) {
				 * resultJSONData.put(key, sectionJsonObj); continue; } }
				 */

				JSONArray jsonArr = JSONUtils.getAsJSONArray(jsonData, key);

				JSONArray resJsonArr = new JSONArray();

				// When effective date is selected
				for (int i = 0; i < jsonArr.length(); i++) {
					try {
						JSONObject individualJsonObj = jsonArr.getJSONObject(i);

						if (individualJsonObj.has(Constants.TIME_FRAME)
								&& !individualJsonObj.isNull(Constants.TIME_FRAME)) {
							String timeFrameStr = individualJsonObj.getString(Constants.TIME_FRAME);
							if (timeFrameStr == null || timeFrameStr.isEmpty()) { // if
																					// data
																					// does
																					// not
																					// have
																					// time
																					// frame
																					// then
																					// insert
																					// the
																					// Json
																					// Object
								resJsonArr.put(individualJsonObj);
							} else { // Pick the closest match
								int closestMatchIndex = findClosestMatchIndex(jsonArr, effectiveDate);
								if (closestMatchIndex != -1) {
									resJsonArr.put(jsonArr.getJSONObject(closestMatchIndex));
									break;
								}
							}
						} else if (individualJsonObj.has(Constants.LINKS)
								&& !individualJsonObj.isNull(Constants.LINKS)) { // TODO
							// Only for Charts series data
							resJsonArr.put(individualJsonObj);
						} else if (individualJsonObj.has(Constants.ROWS) && !individualJsonObj.isNull(Constants.ROWS)) { // For
																															// Tables
							JSONArray rowsArr = individualJsonObj.getJSONArray(Constants.ROWS);
							Set<String> timeSet = new LinkedHashSet<String>();

							for (int j = 0; j < rowsArr.length(); j++) {
								JSONObject rowJsonObject = rowsArr.getJSONObject(j);
								timeSet.add(rowJsonObject.getString(Constants.TIME_FRAME));
							}
							String selectedTime = null;

							for (String time : timeSet) {
								if (!effectiveDate
										.isAfter(LocalDate.parse(time.substring(0, Constants.MM_DD_YYYY.length()),
												DateTimeFormatter.ofPattern(Constants.MM_DD_YYYY)))) {
									continue;
								}
								selectedTime = time;
								break;
							}

							individualJsonObj.put(Constants.ROWS, new JSONArray());
							JSONArray newRowsArr = individualJsonObj.getJSONArray(Constants.ROWS);
							for (int j = 0; j < rowsArr.length(); j++) {
								JSONObject rowJsonObject = rowsArr.getJSONObject(j);
								String timeFrameStr = rowJsonObject.getString(Constants.TIME_FRAME);
								if (timeFrameStr == null || timeFrameStr.isEmpty()) {
									newRowsArr.put(rowJsonObject);
								}
								// if data does not have time frame then insert
								// the Json Object or Pick the match
								else if (timeFrameStr.equals(selectedTime)) {
									if (newRowsArr.length() > 0) {
										boolean foundSimilar = false;
										foundSimilar = findSimilarRow(newRowsArr, rowJsonObject);
										if (!foundSimilar) {
											newRowsArr.put(rowJsonObject);
										}
									} else {
										newRowsArr.put(rowJsonObject);
									}
								}
							}
							resJsonArr.put(individualJsonObj);
						}

					} catch (JSONException oops) {
						LOGGER.error(oops.getMessage());
						continue;
					}
				}

				// Replace the key with Time Effective Json
				resultJSONData.put(key, resJsonArr);

			} catch (Exception ouch) {
				LOGGER.error("Exception: {}", ouch);
				return "{}".toString();
			}
		}
		return resultJSONData.toString();

	}

	private boolean findSimilarRow(JSONArray newRowsArr, JSONObject rowJsonObject) {
		boolean foundSimilar = false;
		for (int k = 0; k < newRowsArr.length(); k++) {
			JSONObject newRowElem = newRowsArr.getJSONObject(k);
			if (newRowElem.similar(rowJsonObject)) {
				foundSimilar = true;
				break;
			}
		}
		return foundSimilar;
	}

	private int findClosestMatchIndex(JSONArray jsonArr, LocalDate effectiveDate) {
		List<LocalDate> timeFrameList = new ArrayList<>();
		for (int i = 0; i < jsonArr.length(); i++) {
			try {
				JSONObject jitJsonObj = jsonArr.getJSONObject(i);
				String timeFrameStr = jitJsonObj.getString(Constants.TIME_FRAME);
				if (timeFrameStr == null || timeFrameStr.trim().isEmpty()) {
					continue;
				}

				timeFrameList.add(LocalDate.parse(timeFrameStr.subSequence(0, Constants.MM_DD_YYYY.length()),
						DateTimeFormatter.ofPattern(Constants.MM_DD_YYYY)));

			} catch (JSONException ouch) {
				continue;
			}
		}

		// find time frame in list which is equal or just before the
		// effective date
		int matchingTimeFrameIndex = -1;
		for (int i = 0; i < timeFrameList.size(); i++) {
			LocalDate timeFrame = timeFrameList.get(i);
			if (timeFrame.isAfter(effectiveDate)) {
				continue;
			}

			matchingTimeFrameIndex = i;
			break;
		}
		return matchingTimeFrameIndex;
	}

}
