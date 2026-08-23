import java.util.HashMap;
import java.util.Map;

public class ScoutingReport {
    public static void main(String[] args) {
        Map<String, String> teamLookup = new HashMap<>();
        teamLookup.put("1515", "Mortorq");
        teamLookup.put("254", "The Cheesy Poofs");

        System.out.println(formatEntry(teamLookup, "1515", "Fast cycle times, reliable auto"));
        System.out.println(formatEntry(teamLookup, 254, "Consistently high scoring"));
    }

    static String formatEntry(Map<String, String> teamLookup, Object teamNumber, String notes) {
        String name = getTeamName(teamLookup, teamNumber);
        return name.toUpperCase() + ": " + notes;
    }

    static String getTeamName(Map<String, String> teamLookup, Object teamNumber) {
        return teamLookup.get(teamNumber);
    }
}
