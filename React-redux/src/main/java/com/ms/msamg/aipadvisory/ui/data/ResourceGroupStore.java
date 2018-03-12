package com.ms.msamg.aipadvisory.ui.data;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.inject.Named;

import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;

import com.fasterxml.jackson.core.JsonParser.Feature;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.ms.msamg.aipadvisory.ui.jo.ResourceGroupJO;
import com.ms.msamg.aipadvisory.ui.jo.SectionJO;
import com.ms.msamg.aipadvisory.ui.jo.SubSectionDefJO;
import com.ms.msamg.aipadvisory.ui.jo.SubSectionIndexJO;
import com.ms.msamg.aipadvisory.ui.util.Constants;

import msjava.base.slf4j.ContextLogger;

@Named
public class ResourceGroupStore {

	private static final Logger LOGGER = ContextLogger.safeLogger();
	
	private String rootLocation;
	

	@Inject
	private Store store;

	@PostConstruct
	public void afterPropertiesSet() {
		rootLocation = store.getRootLocation();
	}

	public String getResourceGroups(String userId) {
		return store.getDataAsString(Paths.get(rootLocation, Constants.RESOURCE_GROUPS, userId + Constants.FILE_EXTENSION_JSON));
	}
	
	public JSONObject getResourceGroupJSON(String entityId, String resourceGroup) {

		JSONObject dataAsJSONObject = store.getDataAsJSONObject(
				Paths.get(rootLocation, entityId, Constants.APPROACH_TWO, Constants.RESOURCE_GROUP, resourceGroup + Constants.FILE_EXTENSION_JSON));
		Set<String> resourceGrpKeySet = dataAsJSONObject.keySet();
		List<SubSectionIndexJO> subSections = new ArrayList<SubSectionIndexJO>();
		resourceGrpKeySet.forEach(rGrp->{
			if (rGrp.equals(Constants.BLOCKS)) {
				JSONArray jsonArray = dataAsJSONObject.getJSONArray(rGrp);
				for (int i=0; i< jsonArray.length(); i++) {
					JSONObject subSecDataObj = jsonArray.getJSONObject(i);
					JSONArray subSecCompArr = subSecDataObj.getJSONArray(Constants.DATA);
					for (int j=0; j<subSecCompArr.length(); j++) {
						JSONObject subSecCompObj = subSecCompArr.getJSONObject(j);
						if(subSecCompObj.has(Constants.ID)){
							SubSectionIndexJO subSectionIndex = new SubSectionIndexJO();
							subSectionIndex.setId(subSecCompObj.getString(Constants.ID));
							subSectionIndex.setComponent(subSecCompObj.getString(Constants.COMPONENT));
							subSectionIndex.setSource(subSecCompObj.has(Constants.SOURCE)?subSecCompObj.getString(Constants.SOURCE):Constants.ODESSA);
							subSections.add(subSectionIndex);
						}
					}
				}
			}			
		});		
		
		JSONObject finalJSONObject = dataAsJSONObject;
		for (SubSectionIndexJO subSecIndex: subSections){
			
			if (null != subSecIndex.getId()){
				Path indexFile = Paths.get(rootLocation, entityId, Constants.APPROACH_TWO, subSecIndex.getSource(), subSecIndex.getId()+Constants.FILE_EXTENSION_JSON);
								
				if (indexFile.toFile().exists()){
					JSONObject fileDataJSONObj = store.getDataAsJSONObject(indexFile);
					finalJSONObject = store.mergeJSONObject(fileDataJSONObj, finalJSONObject);
					
//					if (finalJSONObject.has(subSecIndex.getId()) && finalJSONObject. && finalJSONObject.has(Constants.TIME_FRAME)) {
						
//					}
					
					if (subSecIndex.getComponent().equals(Constants.TABS)){
						finalJSONObject = parseTabsComponentWithDataTables(entityId, finalJSONObject, subSecIndex,fileDataJSONObj);
					}
					
					if (subSecIndex.getComponent().equals(Constants.COLUMN)){
						finalJSONObject = parseColumnComponent(entityId, finalJSONObject, subSecIndex,fileDataJSONObj);
					}					
				}				
			}			
		}
		return finalJSONObject;
	}
	
	/*
	 * To handle components of type "Column" - consists of two level of nesting, below is sample json structure
	 * 
	 "FundOverview": [{
			"data": [{
				"id": "OverviewExecSummary",
				"component": "paragraph",
				"source": "FundRunner"
			},
			{
				"id": "invMgtCo",
				"component": "paragraph",
				"source": "FundRunner"
			}]
		}]
		
		
		{
     	
     			"invMgtCo" : [
     				{
     					
     					"title" : "invMgtCo",
     					"description": "18457 (as of Jan-1970)" 
     				
     				}
     			]		
     				
}
		
	
	*/	
	private JSONObject parseColumnComponent(String entityId, JSONObject finalJSONObject, SubSectionIndexJO subSecIndex, JSONObject fileDataJSONObj) {
		
		if (fileDataJSONObj.has(subSecIndex.getId())) {
			JSONArray columnJSONArr = fileDataJSONObj.getJSONArray(subSecIndex.getId());
			if (!columnJSONArr.isNull(0) && columnJSONArr.length()>0) {			
				JSONArray columnData = columnJSONArr.getJSONObject(0).getJSONArray(Constants.DATA);
				if (null != columnData && columnData.length() > 0) {
					for (int j=0; j<columnData.length(); j++) {
						JSONObject colIndex = columnData.getJSONObject(j);
						if(colIndex.has(Constants.ID) && colIndex.has(Constants.SOURCE)) {
							Path colIndexPath = Paths.get(rootLocation, entityId, Constants.APPROACH_TWO, colIndex.getString(Constants.SOURCE), colIndex.getString(Constants.ID)+Constants.FILE_EXTENSION_JSON);
							if(colIndexPath.toFile().exists()) {
								finalJSONObject = store.mergeJSONObject(store.getDataAsJSONObject(colIndexPath), finalJSONObject);
							}
						}
					}
				}
			}
		}
		
		return finalJSONObject;
	}

	/*
	 * To handle components of type "Tab" - consisting three level of nesting, below is sample json structure
	 *  
		"Runups_and_DrawDown": [{
			"data": [
			{
				"id": "RunupsandDrawDownFund",
				"component": "tab",
				"title": "Runups and DrawDown Fund"
			},
			{
				"id": "RunupsandDrawDownMarket",
				"component": "tab",
				"title": "Runups and DrawDown Market"
			}]
		}],
		"RunupsandDrawDownMarket": [{
			"data": [{
				"id": "runupMarketTable",
				"component": "dataTables",
				"width": "50%",
				"source": "LIMA"
			},
			{
				"id": "drawdownMarketTable",
				"component": "dataTables",
				"width": "50%",
				"source": "LIMA"
			}]
		}],
		"RunupsandDrawDownFund": [{
			"data": [{
				"id": "runupFundTable",
				"component": "dataTables",
				"width": "50%",
				"source": "LIMA"
			},
			{
				"id": "drawdownFundTable",
				"component": "dataTables",
				"width": "50%",
				"source": "LIMA"
			}]
		}]
	*/
	private JSONObject parseTabsComponentWithDataTables(String entityId, JSONObject finalJSONObject,
			SubSectionIndexJO subSecIndex, JSONObject fileDataJSONObj) {
		if (fileDataJSONObj.has(subSecIndex.getId())) {
			JSONObject subSecHead = fileDataJSONObj.getJSONArray(subSecIndex.getId()).getJSONObject(0);
			JSONArray tabsData = subSecHead.getJSONArray(Constants.DATA);
			if (null != tabsData && tabsData.length() > 0) {
				for (int j=0; j<tabsData.length(); j++) {
					JSONObject tabIndex = tabsData.getJSONObject(j);
					if(tabIndex.has(Constants.ID)) {
						String tabIndexId = tabIndex.getString(Constants.ID);	
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
		}
		return finalJSONObject;
	}
	
	/**
	 * This method retrieves Json using Jackson APIs - WIP
	 * 
	 * @param entityId
	 * @param resourceGroup
	 * @return
	 */
	public JSONObject WIP_getResourceGroupJSON(String entityId, String resourceGroup) {

		ObjectMapper objectMapper = new ObjectMapper();
		objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		objectMapper.configure(Feature.ALLOW_BACKSLASH_ESCAPING_ANY_CHARACTER, true);
		objectMapper.configure(Feature.ALLOW_SINGLE_QUOTES, true);
		objectMapper.enable(DeserializationFeature.ACCEPT_SINGLE_VALUE_AS_ARRAY);
		ResourceGroupJO resourceGroupJO = null;
		try {
			resourceGroupJO = objectMapper.readValue(store.getDataAsString(Paths.get(rootLocation, entityId, Constants.APPROACH_TWO, "resourceGroup", resourceGroup + Constants.FILE_EXTENSION_JSON)), ResourceGroupJO.class);
			
//			Below Set and Map operations can be removed if we have Key/Value pair combination for SubSection
//			List<Map<String,List<SubSectionDefJO>>>  subSectionJOList = new ArrayList<Map<String,List<SubSectionDefJO>>>();
//			Map<String, SubSectionDefJO> subSecDefMap = new HashMap<String, SubSectionDefJO>();
			
			Map<String,List<SubSectionDefJO>> subSecDefMap  = new HashMap<String,List<SubSectionDefJO>>();
			
//			Map<String,SubSectionDefJO[]> subSecDefMap  = new HashMap<String,SubSectionDefJO[]>();
//			HashMap<String,Object> o = mapper.readValue(from, typeRef); 
//			String subSectionJSONStr = "";
			JSONObject mergedSubSecJObj = new JSONObject();
			if (null != resourceGroupJO){
				List<SectionJO> blocks = resourceGroupJO.getBlocks();
				for (SectionJO section: blocks){
					for (SubSectionIndexJO subSection: section.getData()){
						if (Constants.ODESSA.equals(subSection.getSource())) {
							String subSectionFileName = subSection.getId()+Constants.FILE_EXTENSION_JSON;
							Path subSectionFilePath = Paths.get(rootLocation, entityId, Constants.APPROACH_TWO, Constants.ODESSA, subSectionFileName);
							subSecDefMap =objectMapper.readValue(store.getDataAsString(subSectionFilePath), new TypeReference<Map<String,List<SubSectionDefJO>>>(){});
//							subSecDefMap= objectMapper.readValue(store.getDataAsString(subSectionFilePath), objectMapper.getTypeFactory().constructCollectionType(List.class, SubSectionDefJO.class));
							JSONObject subSecJObj = new JSONObject(objectMapper.writeValueAsString(subSecDefMap));
							mergedSubSecJObj = store.mergeJSONObject(mergedSubSecJObj, subSecJObj);
							
							/*String temp = objectMapper.writeValueAsString(subSecDefMap).trim();
							temp = temp.substring(1,temp.length()-1);
							subSectionJSONStr = subSectionJSONStr + "," + temp;*/
//							subSectionJOList.add(subSecDefMap);
						} else if (Constants.FUND_RUNNER.equals(subSection.getSource())) {
							String subSectionFileName = subSection.getId()+Constants.FILE_EXTENSION_JSON;
							Path subSectionFilePath = Paths.get(rootLocation, entityId, Constants.APPROACH_TWO, Constants.FUND_RUNNER, subSectionFileName);
							subSecDefMap =objectMapper.readValue(store.getDataAsString(subSectionFilePath), new TypeReference<List<Map<String,List<SubSectionDefJO>>>>(){});
//							subSecDefMap= objectMapper.readValue(store.getDataAsString(subSectionFilePath), objectMapper.getTypeFactory().constructCollectionType(List.class, SubSectionDefJO.class));
							
							JSONObject subSecJObj = new JSONObject(objectMapper.writeValueAsString(subSecDefMap));
							mergedSubSecJObj = store.mergeJSONObject(mergedSubSecJObj, subSecJObj);
							
//							subSectionJOList.add(subSecDefMap);
							/*String temp = objectMapper.writeValueAsString(subSecDefMap).trim();
							temp = temp.substring(1,temp.length()-1);
							subSectionJSONStr = subSectionJSONStr + "," + temp;*/
						}
					}
				}
			}
			
//			String writeValueAsString = objectMapper.writeValueAsString(subSectionJOList);
//			LOGGER.info("SUBSECTION LIST ="+writeValueAsString);
			
			
			
			/*String resourceString = objectMapper.writeValueAsString(resourceGroupJO).trim();
			resourceString = resourceString.substring(1,resourceString.length()-1);
			LOGGER.info("RESOURCE STR = "+resourceString);
			
			String output = "{"+resourceString + subSectionJSONStr+"}";
			LOGGER.info("RESOURCE STR = "+output);*/

			
			JSONObject mergeJSONObject = store.mergeJSONObject(mergedSubSecJObj, new JSONObject(resourceGroupJO));
			
			
			//JSONObject mergeJSONObject = new JSONObject(resourceString);
			//mergeJSONObject = store.mergeJSONObject(new JSONObject(writeValueAsString), mergeJSONObject);
			
//			JSONObject mergeJSONObject = null;
//			objectMapper.writeValue(out, value);
			/*JSONObject mergeJSONObject = null;
			JSONObject resource = new JSONObject(resourceGroupJO);
			mergeJSONObject = resource;
			for(Map<String, List<SubSectionDefJO>> subSec: subSectionJOList){
				
				Set<String> keySet = subSec.keySet();
				Iterator<String> iterator = keySet.iterator();
				while (iterator.hasNext()) {
					String next = iterator.next();
					List<SubSectionDefJO> listSubSecBlocks = subSec.get(next);
					for (SubSectionDefJO subSecInner: listSubSecBlocks) {
						JSONObject subSecJObj = new JSONObject(subSecInner);
						mergeJSONObject = store.mergeJSONObject(subSecJObj, mergeJSONObject);	
					}					
					break; // Breaking because there will always be one subsection in each SubSection.json
				}				
			}*/
			
//			return new JSONObject(output); //mergeJSONObject;
			
			return mergeJSONObject;
		} catch (IOException e) {
			LOGGER.error(e.getLocalizedMessage());
		}
		return new JSONObject();
	}
	
	protected JsonNode merge(JsonNode mainNode, JsonNode updateNode) {

	    Iterator<String> fieldNames = updateNode.fieldNames();

	    while (fieldNames.hasNext()) {
	        String updatedFieldName = fieldNames.next();
	        JsonNode valueToBeUpdated = mainNode.get(updatedFieldName);
	        JsonNode updatedValue = updateNode.get(updatedFieldName);

	        // If the node is an @ArrayNode
	        if (valueToBeUpdated != null && valueToBeUpdated.isArray() && 
	            updatedValue.isArray()) {
	            // running a loop for all elements of the updated ArrayNode
	            for (int i = 0; i < updatedValue.size(); i++) {
	                JsonNode updatedChildNode = updatedValue.get(i);
	                // Create a new Node in the node that should be updated, if there was no corresponding node in it
	                // Use-case - where the updateNode will have a new element in its Array
	                if (valueToBeUpdated.size() <= i) {
	                    ((ArrayNode) valueToBeUpdated).add(updatedChildNode);
	                }
	                // getting reference for the node to be updated
	                JsonNode childNodeToBeUpdated = valueToBeUpdated.get(i);
	                merge(childNodeToBeUpdated, updatedChildNode);
	            }
	        // if the Node is an @ObjectNode
	        } else if (valueToBeUpdated != null && valueToBeUpdated.isObject()) {
	            merge(valueToBeUpdated, updatedValue);
	        } else {
	            if (mainNode instanceof ObjectNode) {
	                ((ObjectNode) mainNode).replace(updatedFieldName, updatedValue);
	            }
	        }
	    }
	    return mainNode;
	}
	

}


