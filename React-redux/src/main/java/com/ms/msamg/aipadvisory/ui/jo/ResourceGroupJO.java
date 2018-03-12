package com.ms.msamg.aipadvisory.ui.jo;

import java.util.List;

public class ResourceGroupJO {

	private List<String> timeFrames;
	private List<SectionJO> blocks;
	private String calendar;
	
	
	public String getCalendar() {
		return calendar;
	}

	public void setCalendar(String calendar) {
		this.calendar = calendar;
	}

	public List<String> getTimeFrames() {
		return timeFrames;
	}

	public void setTimeFrames(List<String> timeFrames) {
		this.timeFrames = timeFrames;
	}

	public List<SectionJO> getBlocks() {
		return blocks;
	}

	public void setBlocks(List<SectionJO> blocks) {
		this.blocks = blocks;
	}

}
