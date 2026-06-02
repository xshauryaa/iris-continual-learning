from __future__ import annotations
from dataclasses import dataclass, field


@dataclass
class BeliefNode:
    id: str
    label: str
    category: str | None
    confidence: float | None
    centrality: float = 0.5
    children: list[BeliefNode] = field(default_factory=list)


class CORE:
    def __init__(self) -> None:
        self._root = BeliefNode(
            id="SELF",
            label="SELF",
            category=None,
            confidence=None,
            centrality=None,
            children=[],
        )

    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------

    def _find(self, node: BeliefNode, target_id: str) -> BeliefNode | None:
        if node.id == target_id:
            return node
        for child in node.children:
            result = self._find(child, target_id)
            if result is not None:
                return result
        return None

    def _all_non_self(self, node: BeliefNode) -> list[BeliefNode]:
        """Return all nodes in the tree excluding SELF."""
        result: list[BeliefNode] = []
        for child in node.children:
            result.append(child)
            result.extend(self._all_non_self(child))
        return result

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def add_belief(self, node: BeliefNode, parent_id: str) -> None:
        if node.centrality is not None and not (0.0 <= node.centrality <= 1.0):
            raise ValueError(f"centrality must be in [0.0, 1.0], got {node.centrality}")
        parent = self._find(self._root, parent_id)
        if parent is None:
            raise ValueError(f"Parent node '{parent_id}' not found")
        parent.children.append(node)

    def get_node(self, id: str) -> BeliefNode:
        node = self._find(self._root, id)
        if node is None:
            raise ValueError(f"Node '{id}' not found")
        return node

    def subtree_size(self, node: BeliefNode) -> int:
        if node.id == "SELF":
            return sum(self.subtree_size(c) for c in node.children)
        return 1 + sum(self.subtree_size(c) for c in node.children)

    def total_beliefs(self) -> int:
        return len(self._all_non_self(self._root))

    def cascade_ratio(self, belief_id: str) -> float:
        """T3 in the IRIS equation: subtree_size / total_beliefs."""
        if belief_id == "SELF":
            raise ValueError("cascade_ratio is not defined for the SELF sentinel node")
        total = self.total_beliefs()
        if total == 0:
            raise ZeroDivisionError("Tree has no belief nodes")
        node = self.get_node(belief_id)
        return self.subtree_size(node) / total

    def get_centrality(self, belief_id: str) -> float:
        """T2 in the IRIS equation: the centrality field of the node."""
        if belief_id == "SELF":
            raise ValueError("get_centrality is not defined for the SELF sentinel node")
        return self.get_node(belief_id).centrality

    def update_centrality(self, belief_id: str, value: float) -> None:
        if belief_id == "SELF":
            raise ValueError("Cannot assign centrality to the SELF sentinel node")
        if not (0.0 <= value <= 1.0):
            raise ValueError(f"centrality must be in [0.0, 1.0], got {value}")
        self.get_node(belief_id).centrality = value

    def update_confidence(self, belief_id: str, value: float) -> None:
        if not (0.0 <= value <= 1.0):
            raise ValueError(f"confidence must be in [0.0, 1.0], got {value}")
        self.get_node(belief_id).confidence = value

    def get_beliefs_by_category(self, category: str) -> list[BeliefNode]:
        return [n for n in self._all_non_self(self._root) if n.category == category]

    # ------------------------------------------------------------------
    # Serialization
    # ------------------------------------------------------------------

    def _node_to_dict(self, node: BeliefNode) -> dict:
        return {
            "id": node.id,
            "label": node.label,
            "category": node.category,
            "confidence": node.confidence,
            "centrality": node.centrality,
            "children": [self._node_to_dict(c) for c in node.children],
        }

    def to_dict(self) -> dict:
        return self._node_to_dict(self._root)

    @classmethod
    def _node_from_dict(cls, data: dict) -> BeliefNode:
        return BeliefNode(
            id=data["id"],
            label=data["label"],
            category=data["category"],
            confidence=data["confidence"],
            centrality=data["centrality"],
            children=[cls._node_from_dict(c) for c in data.get("children", [])],
        )

    @classmethod
    def from_dict(cls, data: dict) -> CORE:
        instance = cls.__new__(cls)
        instance._root = cls._node_from_dict(data)
        return instance
