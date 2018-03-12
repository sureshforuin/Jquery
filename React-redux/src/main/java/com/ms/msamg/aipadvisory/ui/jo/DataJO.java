package com.ms.msamg.aipadvisory.ui.jo;

import java.util.HashMap;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonAnyGetter;
import com.fasterxml.jackson.annotation.JsonAnySetter;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonFormat(shape = JsonFormat.Shape.ANY)
// @JsonIgnoreProperties(ignoreUnknown = true)
// @JsonDeserialize(using = ProductDeserializer.class)
public class DataJO {

	@JsonProperty("data")
	@JsonIgnore
	private String data;

	@JsonProperty("metadata")
	private MetaDataJO metadata;

	// @JsonUnwrapped
	// private Map<String, String> dataMap;
	@JsonFormat(shape = JsonFormat.Shape.ARRAY)	
	private Map<String, String> other = new HashMap<String, String>();

	public String getData() {
		return data;
	}

	public void setData(String data) {
		this.data = data;
	}

	public MetaDataJO getMetadata() {
		return metadata;
	}

	public void setMetadata(MetaDataJO metadata) {
		this.metadata = metadata;
	}

	@JsonAnyGetter
	public Map<String, String> any() {
		return other;
	}

	@JsonAnySetter
	public void set(String name, String value) {
		other.put(name, value);
	}

}
