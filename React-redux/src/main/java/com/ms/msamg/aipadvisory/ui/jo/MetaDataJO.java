package com.ms.msamg.aipadvisory.ui.jo;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonFormat(shape = JsonFormat.Shape.ANY)
@JsonIgnoreProperties(ignoreUnknown = true)
public class MetaDataJO {

	private String defaultProp;
	private String type;
	private Integer total;
	
	public String getDefaultProp() {
		return defaultProp;
	}
	public void setDefaultProp(String defaultProp) {
		this.defaultProp = defaultProp;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public Integer getTotal() {
		return total;
	}
	public void setTotal(Integer total) {
		this.total = total;
	}
}
