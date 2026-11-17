import { describe, expect, it } from "vitest";
import { holdsLeaveApprove, mayDecide, routeApprover } from "./authorize";

describe("routeApprover", () => {
  it("sends a request to the manager on the reporting line", () => {
    expect(routeApprover("ena")).toEqual({ approverKey: "sofia" });
    expect(routeApprover("hana")).toEqual({ approverKey: "rico" });
  });

  it("reroutes to an HR admin when there is no manager (SoD-2) and says why", () => {
    const result = routeApprover("rico");
    expect(result.approverKey).toBe("hana");
    expect(result.routing).toEqual({ reroutedTo: "Hana Reyes", reasonCode: "SOD_2" });
  });

  it("never routes a request to its own requester", () => {
    for (const key of ["rico", "hana", "ena", "sofia", "marco", "faye"]) {
      expect(routeApprover(key).approverKey).not.toBe(key);
    }
  });
});

describe("mayDecide", () => {
  const request = { requesterKey: "ena", approverKey: "sofia" };

  it("allows the assigned approver", () => {
    expect(mayDecide("sofia", request)).toEqual({ allow: true });
  });

  it("refuses the requester with SOD_2, even if they would otherwise be the approver", () => {
    expect(mayDecide("ena", request)).toEqual({ allow: false, status: 403, reasonCode: "SOD_2" });
    expect(mayDecide("hana", { requesterKey: "hana", approverKey: "hana" })).toMatchObject({ allow: false, reasonCode: "SOD_2" });
  });

  it("hides the request from anyone who isn't the approver (404, not 403)", () => {
    expect(mayDecide("marco", request)).toEqual({ allow: false, status: 404, reasonCode: "NO_PERMISSION_IN_SCOPE" });
  });
});

describe("holdsLeaveApprove", () => {
  it("is true for managers and HR admins, false for everyone else", () => {
    expect(holdsLeaveApprove("sofia")).toBe(true);
    expect(holdsLeaveApprove("hana")).toBe(true);
    expect(holdsLeaveApprove("ena")).toBe(false);
    expect(holdsLeaveApprove("carla")).toBe(false);
  });
});
