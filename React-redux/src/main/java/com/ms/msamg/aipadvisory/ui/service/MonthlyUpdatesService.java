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

import com.ms.msamg.aipadvisory.ui.data.MonthlyUpdatesStore;
import com.ms.msamg.aipadvisory.ui.util.Constants;
import com.ms.msamg.aipadvisory.util.JSONUtils;

import io.swagger.annotations.Api;
import msjava.base.slf4j.ContextLogger;
import msjava.cxfutils.autoconf.experimental.annotation.transport.HTTPServerTransport;

@Api
@HTTPServerTransport(name = "commonTransport", mapping = "/msamg.aip-advisory-portal-ui/services/monthlyUpdatesService")
@Named
@Path("/")
@Produces(MediaType.APPLICATION_JSON)
public class MonthlyUpdatesService {

	private static final Logger LOGGER = ContextLogger.safeLogger();

	@Inject
	private MonthlyUpdatesStore monthlyUpdatesStore;

	@GET
	@Path("{entityId}/approachOne/{resourceGroup}/{fileName}")
	public String approachOne(@PathParam("entityId") String entityId, @PathParam("resourceGroup") String resourceGroup,
			@PathParam("fileName") String fileName) {
		long start = System.nanoTime();
		String output = monthlyUpdatesStore.getMonthlyUpdates(entityId, resourceGroup, fileName).toString();
		LOGGER.info("Time taken to process JSON from store in approach one = {} ms",
				(System.nanoTime() - start) / 1_000_000.0);
		return output;
	}

	@GET
	@Path("{entityId}/OLD_approachTwo/{resourceGroup}")
	public String approachTwo(@PathParam("entityId") String entityId, @PathParam("resourceGroup") String resourceGroup,
			@QueryParam("effectiveDate") String effectiveDateStr) {
		long start = System.nanoTime();
		JSONObject jsonData = monthlyUpdatesStore.getMonthlyUpdates(entityId, resourceGroup);
		String jsonDataStr = getJsonForEffectiveDate(effectiveDateStr, jsonData);

		LOGGER.info("Time taken to process JSON from store in approach two = {} ms",
				(System.nanoTime() - start) / 1_000_000.0);
		return jsonDataStr;
	}

	@GET
	@Path("{entityId}/approachTwo/{resourceGroup}")
	public String approachThree(@PathParam("entityId") String entityId, @PathParam("resourceGroup") String resourceGroup,
			@QueryParam("effectiveDate") String effectiveDateStr) {
		long start = System.nanoTime();
		JSONObject jsonData = monthlyUpdatesStore.getAIPToolJSONObj(entityId, resourceGroup);
		String jsonDataStr = getJsonForEffectiveDate(effectiveDateStr, jsonData);

		LOGGER.info("Time taken to process JSON from store in approach two = {} ms",
				(System.nanoTime() - start) / 1_000_000.0);
		return jsonDataStr;
	}
	
	private String getJsonForEffectiveDate(String effectiveDateStr, JSONObject jsonData) {
		if (effectiveDateStr == null || effectiveDateStr.trim().length() <=0) {
			effectiveDateStr = LocalDate.now().format(DateTimeFormatter.ofPattern(Constants.MM_DD_YYYY));
		}
		
		LocalDate effectiveDate = LocalDate.parse(effectiveDateStr, DateTimeFormatter.ofPattern(Constants.MM_DD_YYYY));
		
		Set<String> keys = jsonData.keySet();
		Set<String> ignoreKeys = new HashSet<>(Arrays.asList(Constants.TIME_FRAMES, Constants.BLOCKS,
				Constants.FUND_STRUCTURE, Constants.SUBSCRIPTON, Constants.FUND_OVERVIEW, Constants.FUND_HIGHLIGHTS,
				Constants.FUND_AUM_TABLE, Constants.STRATEGY_AUM_TABLE, Constants.MANAGEMENT_COMPANY_AUM_TABLE,
				Constants.SERVICE_PROVIDER_OVERVIEW,  "MostPositivelySimilar","MostDissimilar",
				 Constants.RUNUPS_AND_DRAWDOWN,
				 Constants.RUNUP_MARKET_TABLE, 
				 Constants.RUNUPS_AND_DRAWDOWN_FUND,
				 Constants.RUNUPS_AND_DRAWDOWN_MARKET,
				 Constants.DRAWDOWN_FUND_TABLE,
				 Constants.RUNUP_FUND_TABLE,
				 Constants.RUNUPS_AND_DRAWDOWN,
				 Constants.DRAWDOWN_MARKET_TABLE,
				 Constants.MARKET_BENCHMARK, Constants.KEY_STATS, Constants.HEDGE_FUND_BENCHMARK , Constants.RATINGS_OVERVIEW , Constants.SHARE_CLASS, "AnnualizedStats"));
		
		
		
		Set<String> fundTableKeys = new HashSet<>(Arrays.asList(Constants.STYLE, Constants.AUM , Constants.STRUCTURE , Constants.DOMICILE, "Auditor" , "Administrator",
							Constants.GEOGRAPHICFOCUS ,Constants.INVMGTCO));
		JSONObject resultJSONData = new JSONObject();
		
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
				
			
				JSONArray jsonArr = JSONUtils.getAsJSONArray(jsonData, key);
				
				JSONArray resJsonArr = new JSONArray();
				
				// When effective date is selected
				for (int i=0; i<jsonArr.length(); i++) {
					try{
						JSONObject individualJsonObj = jsonArr.getJSONObject(i);
						
						if(individualJsonObj.has(Constants.TIME_FRAME)) {
							String timeFrameStr = individualJsonObj.getString(Constants.TIME_FRAME);
							if (timeFrameStr == null || timeFrameStr.isEmpty()) { // if data does not have time frame then insert the Json Object
								resJsonArr.put(individualJsonObj);
							} else { // Pick the closest match
								int closestMatchIndex = findClosestMatchIndex(jsonArr, effectiveDate);
								if (closestMatchIndex != -1) {
									resJsonArr.put(jsonArr.getJSONObject(closestMatchIndex));
									break;
								}
							}	
						}						
						else if (individualJsonObj.has(Constants.LINKS)) { //TODO Only for Charts series data 
							resJsonArr.put(individualJsonObj);
						}
						else {// For Tables
							JSONArray rowsArr = individualJsonObj.getJSONArray(Constants.ROWS);
							Set<String> timeSet = new LinkedHashSet<String>();
							
							for (int j=0; j<rowsArr.length(); j++) {
								 JSONObject rowJsonObject = rowsArr.getJSONObject(j);
								 timeSet.add(rowJsonObject.getString(Constants.TIME_FRAME));
							}
							String selectedTime = null;
							
							for (String time: timeSet) {
								if (!effectiveDate.isAfter(LocalDate.parse(time.substring(0,Constants.MM_DD_YYYY.length()), DateTimeFormatter.ofPattern(Constants.MM_DD_YYYY)))) {
									continue;
								}
								selectedTime = time;
								break;
							}
							
							individualJsonObj.put(Constants.ROWS,new JSONArray());
							JSONArray newRowsArr = individualJsonObj.getJSONArray(Constants.ROWS);
							for (int j=0; j<rowsArr.length(); j++) {
								 JSONObject rowJsonObject = rowsArr.getJSONObject(j);
								 String timeFrameStr = rowJsonObject.getString(Constants.TIME_FRAME);
								 if (timeFrameStr == null || timeFrameStr.isEmpty()) {
									 newRowsArr.put(rowJsonObject);
								 }
								// if data does not have time frame then insert the Json Object or Pick the match
								 else if (timeFrameStr.equals(selectedTime)){	 
									if (newRowsArr.length() > 0){
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
													
					} catch (JSONException oops){
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
		 for (int k=0; k <newRowsArr.length(); k++) {
			 JSONObject newRowElem = newRowsArr.getJSONObject(k);
			 if (newRowElem.similar(rowJsonObject)){
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
