from core import BeliefNode, CORE


def build_tree() -> tuple[CORE, str, str, str, str]:
    core = CORE()

    sm1 = BeliefNode(id="self_model_001", label="I am a helpful assistant", category="self-model", confidence=0.95, centrality=0.9)
    sm2 = BeliefNode(id="self_model_002", label="I value honesty", category="self-model", confidence=0.85, centrality=0.6)
    v1  = BeliefNode(id="value_001",      label="Harm avoidance is paramount", category="value", confidence=0.90, centrality=0.8)
    ep1 = BeliefNode(id="epistemic_001",  label="Uncertainty should be acknowledged", category="epistemic", confidence=0.75, centrality=0.4)

    core.add_belief(sm1, parent_id="SELF")
    core.add_belief(sm2, parent_id="SELF")
    core.add_belief(v1,  parent_id="SELF")
    core.add_belief(ep1, parent_id="self_model_001")  # child of sm1

    return core, sm1.id, sm2.id, v1.id, ep1.id


def test_total_beliefs():
    core, *_ = build_tree()
    assert core.total_beliefs() == 4, f"Expected 4, got {core.total_beliefs()}"


def test_cascade_ratio_with_child():
    core, sm1_id, *_ = build_tree()
    # sm1 has 1 child (ep1), so subtree_size = 2; total = 4 → ratio = 0.5
    ratio = core.cascade_ratio(sm1_id)
    assert ratio == 0.5, f"Expected 0.5, got {ratio}"


def test_cascade_ratio_leaf():
    core, _, sm2_id, *_ = build_tree()
    # sm2 is a leaf → subtree_size = 1; total = 4 → ratio = 0.25
    ratio = core.cascade_ratio(sm2_id)
    assert ratio == 0.25, f"Expected 0.25, got {ratio}"


def test_get_centrality():
    core, *_ = build_tree()
    assert core.get_centrality("self_model_001") == 0.9


def test_cascade_ratio_self_raises():
    core, *_ = build_tree()
    raised = False
    try:
        core.cascade_ratio("SELF")
    except ValueError:
        raised = True
    assert raised, "Expected ValueError for cascade_ratio('SELF')"


def test_get_centrality_self_raises():
    core, *_ = build_tree()
    raised = False
    try:
        core.get_centrality("SELF")
    except ValueError:
        raised = True
    assert raised, "Expected ValueError for get_centrality('SELF')"


def test_update_centrality():
    core, *_ = build_tree()
    core.update_centrality("self_model_002", 0.75)
    assert core.get_centrality("self_model_002") == 0.75


def test_get_beliefs_by_category():
    core, *_ = build_tree()
    epistemic_nodes = core.get_beliefs_by_category("epistemic")
    assert len(epistemic_nodes) == 1
    assert epistemic_nodes[0].id == "epistemic_001"


def test_round_trip():
    core, *_ = build_tree()
    data = core.to_dict()
    restored = CORE.from_dict(data)

    assert restored.total_beliefs() == 4
    assert restored.get_centrality("self_model_001") == 0.9
    assert restored.get_centrality("value_001") == 0.8
    assert restored.get_node("self_model_001").confidence == 0.95
    assert restored.get_node("epistemic_001").confidence == 0.75
    # Structural integrity: ep1 is still a child of sm1
    sm1 = restored.get_node("self_model_001")
    assert any(c.id == "epistemic_001" for c in sm1.children)
    assert restored.cascade_ratio("self_model_001") == 0.5


if __name__ == "__main__":
    test_total_beliefs()
    test_cascade_ratio_with_child()
    test_cascade_ratio_leaf()
    test_get_centrality()
    test_cascade_ratio_self_raises()
    test_get_centrality_self_raises()
    test_update_centrality()
    test_get_beliefs_by_category()
    test_round_trip()
    print("All assertions passed.")
