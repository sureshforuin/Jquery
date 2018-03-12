package com.ms.msamg.aipadvisory.ui.data;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.inject.Named;

import org.json.JSONArray;
import org.json.JSONObject;

import com.google.gson.Gson;
import com.ms.msamg.aipadvisory.ui.jo.ResourceGroupJO;
import com.ms.msamg.aipadvisory.ui.jo.SectionJO;
import com.ms.msamg.aipadvisory.ui.jo.SubSectionDefJO;
import com.ms.msamg.aipadvisory.ui.jo.SubSectionIndexJO;
import com.ms.msamg.aipadvisory.ui.util.Constants;

@Named
public class MonthlyUpdatesStore {

	private String rootLocation;

	@Inject
	private Store store;

	@PostConstruct
	public void afterPropertiesSet() {
		rootLocation = store.getRootLocation();
	}

	public JSONObject getMonthlyUpdates(String entityId, String resourceGroup) {
		return store.getDataAsJSONObject(
				Paths.get(rootLocation, entityId, Constants.APPROACH_TWO, resourceGroup, "data.json"));
	}

	public JSONObject getAIPToolJSONObj(String entityId, String resourceGroup) {

		JSONObject dataAsJSONObject = store.getDataAsJSONObject(
				Paths.get(rootLocation, entityId, Constants.APPROACH_TWO, "resourceGroup", resourceGroup + ".json"));
		
		JSONObject dataAsJSONObjectFundsLDD = store.getDataAsJSONObject(
				Paths.get(rootLocation, entityId, Constants.APPROACH_TWO, Constants.ODESSA, "FundStructure" + ".json"));
		
		JSONObject dataAsJSONObjectSubscriptionLDD = store.getDataAsJSONObject(
				Paths.get(rootLocation, entityId, Constants.APPROACH_TWO, Constants.ODESSA, "Subscription" + ".json"));
		
		
		JSONObject dataAsJSONObjectFundsOverview = store.getDataAsJSONObject(
				Paths.get(rootLocation, entityId, Constants.APPROACH_TWO, Constants.FUND_RUNNER, "FundOverview" + ".json"));
		
		JSONObject dataAsJSONObjectFundsHighlights = store.getDataAsJSONObject(
				Paths.get(rootLocation, entityId, Constants.APPROACH_TWO, Constants.FUND_RUNNER, "FundHighlights" + ".json"));
		
		Set<String> resourceGrpKeySet = dataAsJSONObject.keySet();
		Set<String> resourceGrpKeySetFunds = dataAsJSONObjectFundsLDD.keySet();
		Set<String> resourceGrpKeySetSubscription = dataAsJSONObjectSubscriptionLDD.keySet();
		
		Set<String> resourceGrpKeySetFundOverview = dataAsJSONObjectFundsOverview.keySet();
		Set<String> resourceGrpKeySetFundHighlights = dataAsJSONObjectFundsHighlights.keySet();
		
		
		List<String> subSectionList = new ArrayList<String>();
		List<SubSectionIndexJO> subSectionObjList = new ArrayList<SubSectionIndexJO>();
		resourceGrpKeySet.forEach(rGrp->{
			if (rGrp.equals(Constants.BLOCKS)) {
				JSONArray jsonArray = dataAsJSONObject.getJSONArray(rGrp);
				for (int i=0; i< jsonArray.length(); i++) {
					JSONObject subSecDataObj = jsonArray.getJSONObject(i);
					JSONArray subSecCompArr = subSecDataObj.getJSONArray(Constants.DATA);
					for (int j=0; j<subSecCompArr.length(); j++) {
						JSONObject subSecCompObj = subSecCompArr.getJSONObject(j);
						if(subSecCompObj.has(Constants.ID)){
							subSectionList.add(subSecCompObj.getString(Constants.ID));
							SubSectionIndexJO subSectionIndex = new SubSectionIndexJO();
							subSectionIndex.setId(subSecCompObj.getString(Constants.ID));
							subSectionIndex.setComponent(subSecCompObj.getString(Constants.COMPONENT));
							subSectionIndex.setSource(subSecCompObj.has(Constants.SOURCE)?subSecCompObj.getString(Constants.SOURCE):Constants.ODESSA);
							subSectionObjList.add(subSectionIndex);
						}
					}
				}
			}			
		});
		

		
		resourceGrpKeySetFunds.forEach(rGrp->{
			if (rGrp.equals("FundStructure")) {
				JSONArray jsonArray = dataAsJSONObjectFundsLDD.getJSONArray(rGrp);
				for (int i=0; i< jsonArray.length(); i++) {
					JSONObject subSecDataObj = jsonArray.getJSONObject(i);
					JSONArray subSecCompArr = subSecDataObj.getJSONArray("data");
					for (int j=0; j<subSecCompArr.length(); j++) {
						JSONObject subSecCompObj = subSecCompArr.getJSONObject(j);
						if(subSecCompObj.has(Constants.ID)){
							subSectionList.add(subSecCompObj.getString(Constants.ID));
							SubSectionIndexJO subSectionIndex = new SubSectionIndexJO();
							subSectionIndex.setId(subSecCompObj.getString(Constants.ID));
							subSectionIndex.setComponent(subSecCompObj.getString(Constants.COMPONENT));
							subSectionIndex.setSource(subSecCompObj.has(Constants.SOURCE)?subSecCompObj.getString(Constants.SOURCE):Constants.ODESSA);
							subSectionObjList.add(subSectionIndex);
						}
					}
				}
			}
			
		});
		
		
		resourceGrpKeySetSubscription.forEach(rGrp->{
			if (rGrp.equals("Subscription")) {
				JSONArray jsonArray = dataAsJSONObjectSubscriptionLDD.getJSONArray(rGrp);
				for (int i=0; i< jsonArray.length(); i++) {
					JSONObject subSecDataObj = jsonArray.getJSONObject(i);
					JSONArray subSecCompArr = subSecDataObj.getJSONArray("data");
					for (int j=0; j<subSecCompArr.length(); j++) {
						JSONObject subSecCompObj = subSecCompArr.getJSONObject(j);
						if(subSecCompObj.has(Constants.ID)){
							subSectionList.add(subSecCompObj.getString(Constants.ID));
							SubSectionIndexJO subSectionIndex = new SubSectionIndexJO();
							subSectionIndex.setId(subSecCompObj.getString(Constants.ID));
							subSectionIndex.setComponent(subSecCompObj.getString(Constants.COMPONENT));
							subSectionIndex.setSource(subSecCompObj.has(Constants.SOURCE)?subSecCompObj.getString(Constants.SOURCE):Constants.ODESSA);
							subSectionObjList.add(subSectionIndex);
						}
					}
				}
			}
			
		});
		
		
		resourceGrpKeySetFundOverview.forEach(rGrp->{
			if (rGrp.equals("FundOverview")) {
				JSONArray jsonArray = dataAsJSONObjectFundsOverview.getJSONArray(rGrp);
				for (int i=0; i< jsonArray.length(); i++) {
					JSONObject subSecDataObj = jsonArray.getJSONObject(i);
					JSONArray subSecCompArr = subSecDataObj.getJSONArray("data");
					for (int j=0; j<subSecCompArr.length(); j++) {
						JSONObject subSecCompObj = subSecCompArr.getJSONObject(j);
						if(subSecCompObj.has(Constants.ID)){
							subSectionList.add(subSecCompObj.getString(Constants.ID));
							SubSectionIndexJO subSectionIndex = new SubSectionIndexJO();
							subSectionIndex.setId(subSecCompObj.getString(Constants.ID));
							subSectionIndex.setComponent(subSecCompObj.getString(Constants.COMPONENT));
							subSectionIndex.setSource(subSecCompObj.has(Constants.SOURCE)?subSecCompObj.getString(Constants.SOURCE):Constants.FUND_RUNNER);
							
							subSectionObjList.add(subSectionIndex);
						}
					}
				}
			}
			
		});
		
		
		resourceGrpKeySetFundHighlights.forEach(rGrp->{
			if (rGrp.equals("FundHighlights")) {
				JSONArray jsonArray = dataAsJSONObjectFundsHighlights.getJSONArray(rGrp);
				for (int i=0; i< jsonArray.length(); i++) {
					JSONObject subSecDataObj = jsonArray.getJSONObject(i);
					JSONArray subSecCompArr = subSecDataObj.getJSONArray("data");
					for (int j=0; j<subSecCompArr.length(); j++) {
						JSONObject subSecCompObj = subSecCompArr.getJSONObject(j);
						if(subSecCompObj.has(Constants.ID)){
							subSectionList.add(subSecCompObj.getString(Constants.ID));
							SubSectionIndexJO subSectionIndex = new SubSectionIndexJO();
							subSectionIndex.setId(subSecCompObj.getString(Constants.ID));
							subSectionIndex.setComponent(subSecCompObj.getString(Constants.COMPONENT));
							subSectionIndex.setSource(subSecCompObj.has(Constants.SOURCE)?subSecCompObj.getString(Constants.SOURCE):Constants.FUND_RUNNER);
							subSectionObjList.add(subSectionIndex);
						}
					}
				}
			}
			
		});
		
		JSONObject finalJSONObject = dataAsJSONObject;
		for (SubSectionIndexJO subSecIndex: subSectionObjList){
			
			if (null != subSecIndex.getId() ){
				Path indexFile = Paths.get(rootLocation, entityId, Constants.APPROACH_TWO);
				if ( subSecIndex.getSource().equals(Constants.ODESSA)){
					indexFile= Paths.get(rootLocation, entityId, Constants.APPROACH_TWO, Constants.ODESSA, subSecIndex.getId()+Constants.FILE_EXTENSION_JSON);
				} else if (subSecIndex.getSource().equals(Constants.FUND_RUNNER)){
					indexFile= Paths.get(rootLocation, entityId, Constants.APPROACH_TWO, Constants.FUND_RUNNER, subSecIndex.getId()+Constants.FILE_EXTENSION_JSON);
				} else if (subSecIndex.getSource().equals(Constants.LIMA)){
					indexFile= Paths.get(rootLocation, entityId, Constants.APPROACH_TWO, Constants.LIMA, subSecIndex.getId()+Constants.FILE_EXTENSION_JSON);
				}
				if (indexFile.toFile().exists()){
					JSONObject fileDataJSONObj = store.getDataAsJSONObject(indexFile);
					finalJSONObject = store.mergeJSONObject(fileDataJSONObj, finalJSONObject);
					
					if (subSecIndex.getComponent().equals(Constants.TABS)){
						finalJSONObject = parseTabsComponentWithDataTables(entityId, finalJSONObject, subSecIndex,fileDataJSONObj);
					}					
				}				
			}			
		}
		return finalJSONObject;
	}
	
	private JSONObject parseTabsComponentWithDataTables(String entityId, JSONObject finalJSONObject,
			SubSectionIndexJO subSecIndex, JSONObject fileDataJSONObj) {
		if (fileDataJSONObj.has(subSecIndex.getId())) {
			JSONObject subSecHead = fileDataJSONObj.getJSONArray(subSecIndex.getId()).getJSONObject(0);
			JSONArray tabsData = subSecHead.getJSONArray(Constants.DATA);
			for (int j=0; j<tabsData.length(); j++) {
				JSONObject tabIndex = tabsData.getJSONObject(j);
				if(tabIndex.has(Constants.ID)) {
					String tabIndexId = tabIndex.getString(Constants.ID);	
					System.out.println(tabIndexId);
					JSONObject tabData  = fileDataJSONObj.getJSONArray(tabIndexId).getJSONObject(0);
					JSONArray dataTables = tabData.getJSONArray(Constants.DATA);
					for (int k=0; k<dataTables.length(); k++){
						JSONObject dataTable = dataTables.getJSONObject(k);
						if (dataTable.has(Constants.ID) && dataTable.getString(Constants.COMPONENT).equals(Constants.DATA_TABLES)){
							String dataTableId = dataTable.getString(Constants.ID);									
							//TODO: FundId folder to be used instead of Fund1 folder
							Path dataTableFile = Paths.get(rootLocation, entityId, Constants.APPROACH_TWO, Constants.FUND1, dataTableId+Constants.FILE_EXTENSION_JSON);
							if (dataTableFile.toFile().exists()) {
								JSONObject dataTableJson = new JSONObject();
								JSONArray dataTableJsonArray = new JSONArray();
								dataTableJsonArray.put(store.getDataAsJSONObject(dataTableFile));
								dataTableJson.put(dataTableId, dataTableJsonArray);												
								finalJSONObject = store.mergeJSONObject(dataTableJson, finalJSONObject);
							}
						}
					}									
				}
			}
		}
		return finalJSONObject;
	}

	public JSONObject getMonthlyUpdates(String entityId, String resourceGroup, String fileName) {
		return store.getDataAsJSONObject(Paths.get(rootLocation, entityId, "approachOne", resourceGroup, fileName));
	}
	
	/**
	 * NOTE: This method is added to try generation of JSON using Gson API and Pojos. This API helps to avoid multiple looping and error prone string operation.
	 * 
	 */
	// TODO: This approach needs one change in SubSection JSON file to hold a key and value pair. Feasibility of this approach to be checked
	/*
	 * Current SubSection JSON is 
	 * {
	 *  MonthlyUpdates: {.
	 *  ......
	 * }
	 * Required SubSection JSON structure would be 
	 * {
	 *		SubSection: MonthlyUpdates
	 *  	SubSectionDef: {
	 *  		title : .....,
	 *  		........
	 *  	}
	 * }
	 * If we assign Key and Value pair API will map the values automatically.
	 * 
	 */
	public JSONObject getAIPToolJSONObj_TEST_NEW_APPROACH(String entityId, String resourceGroup) {
		Gson resourceGroupGson = new Gson();
		ResourceGroupJO resourceGroupJO = resourceGroupGson.fromJson(store.getDataAsString(Paths.get(rootLocation, entityId, Constants.APPROACH_TWO, "resourceGroup", resourceGroup + ".json")), ResourceGroupJO.class);
		
		Gson subSectionGson = new Gson();
		
		//Below Set and Map operations can be removed if we have Key/Value pair combination for SubSection
		Set<Map<String, SubSectionDefJO>> subSectionJOList = new HashSet<Map<String, SubSectionDefJO>>();
		Map<String, SubSectionDefJO> subSecDefMap = new HashMap<String, SubSectionDefJO>();
		
		
		if (null != resourceGroupJO){
			List<SectionJO> blocks = resourceGroupJO.getBlocks();
			for (SectionJO section: blocks){
				for (SubSectionIndexJO subSection: section.getData()){
					if (Constants.ODESSA.equals(subSection.getSource())) {
						String subSectionFileName = subSection.getId()+".json";
						Path subSectionFilePath = Paths.get(rootLocation, entityId, Constants.APPROACH_TWO, Constants.ODESSA, subSectionFileName);
						subSecDefMap = (Map<String, SubSectionDefJO>) subSectionGson.fromJson(store.getDataAsString(subSectionFilePath), subSecDefMap.getClass());
						subSectionJOList.add(subSecDefMap);
					} else if (Constants.FUND_RUNNER.equals(subSection.getSource())) {
						String subSectionFileName = subSection.getId()+".json";
						Path subSectionFilePath = Paths.get(rootLocation, entityId, Constants.APPROACH_TWO, Constants.FUND_RUNNER, subSectionFileName);
						subSecDefMap = (Map<String, SubSectionDefJO>) subSectionGson.fromJson(store.getDataAsString(subSectionFilePath), subSecDefMap.getClass());
						subSectionJOList.add(subSecDefMap);
					}
				}
			}
		}
		
		StringBuffer mergeStrBuff = new StringBuffer(resourceGroupGson.toJson(resourceGroupJO));
		String subSecStr = resourceGroupGson.toJson(subSectionJOList);
		subSecStr = subSecStr.substring(1, subSecStr.length()-1);
		mergeStrBuff.append(subSecStr);
				
		
		System.out.println("Return JSON Resource Group = "+mergeStrBuff);

		return new JSONObject(mergeStrBuff.toString());
	}



}
